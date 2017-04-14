var express = require('express'),
    router = express.Router(),
    tool = require('../../common/tool'),
    ENUMS = require('../../common/enums'),
    NoteService = require('../../service/noteService');

module.exports = function (app) {
  app.use('/noteApi/notes', router);
};

router.post('/add', tool.requireUserId, function (req, res, next) {
  var _userId = req.noteUserId;
  tool.checkAuth(_userId, function (err, user) {
    if (err) {
      return res.json(err);
    }

    var title = req.body.title.trim(),
        tag = req.body.tag,
        content = req.body.content;

    //表单验证
    req.checkBody('title', '请输入标题').notEmpty();
    req.checkBody('content', '请输入内容').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
      return res.json({
        code: 400,
        message: '参数有误',
        formInvalids: errors
      });
    }

    var newNote = {
      title: title,
      tag: tag,
      content: content,
      owner: _userId,
      created: new Date()
    };

    NoteService.createNote(newNote, function (err, note) {
      if (err) {
        console.log('/noteApi/tags/add error:', err);
        res.json({
          code: 500,
          message: '系统内部错误'
        });
      } else {
        res.json({
          code: 200,
          message: '访问成功',
          object: note
        });
      }
    });

  })
});

router.post('/edit', tool.requireUserId, function (req, res, next) {

  var noteId = req.body._id,
      title = req.body.title.trim(),
      content = req.body.content,
      tag = req.body.tag;

  //表单验证
  req.checkBody('_id', '请提供笔记ID').notEmpty();
  req.checkBody('title', '请输入标题').notEmpty();
  req.checkBody('content', '请输入笔记内容').notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    return res.json({
      code: 500,
      message: '系统内部错误'
    });
  }

  NoteService.getNoteById(noteId, function (err, note) {
    if (err) {
      return res.json({
        code: 400,
        message: '参数有误',
        formInvalids: errors
      });
    }

    note.title = title;
    note.content = content;
    note.tag = tag;

    note.save(function (err, note) {
      if (err) {
        res.json({
          code: 500,
          message: '系统内部错误'
        });
      } else {
        res.json({
          code: 200,
          message: '访问成功',
          object: note
        });
      }
    });
  });

});

router.get('/detail/:noteId', tool.requireUserId, function (req, res, next) {

  var noteId = req.params.noteId;

  if (!noteId) {
    return res.json({
      code: 400,
      message: '参数错误'
    });
  }

  NoteService.getNoteWithTag(noteId, ['tag'], function (err, note) {

    if (err) {
      res.json({
        code: 500,
        message: '系统内部错误'
      });
    } else {
      res.json({
        code: 200,
        message: '访问成功',
        object: note
      });
    }

  });

});

router.get('/delete/:noteId', tool.requireUserId, function (req, res, next) {

  var _userId = req.noteUserId;
  var noteId = req.params.noteId;

  if (!noteId) {
    return res.json({
      code: 400,
      message: '参数错误'
    });
  }

  NoteService.getNoteById(noteId, function (err, note) {

    if (err) {
      return res.json({
        code: 500,
        message: '系统错误'
      });
    }

    if (!note) {
      return res.json({
        code: 411,
        message: '找不到对应的笔记'
      });
    } else {
      var match = note.owner.toString() === _userId;
      if ( match ) {
        NoteService.removeNoteById(noteId, function (err) {
          if (err) {
            res.json({
              code: 411,
              message: '找不到对应的笔记'
            });
          } else {
            res.json({
              code: 200,
              message: '访问成功',
              object: note
            })
          }
        });
      }
    }

  });

});


router.get('/page', tool.requireUserId, function (req, res, next) {

  var _userId = req.noteUserId;

  var page = req.query.page,
      size = parseInt(req.query.size);

  //表单验证
  req.checkQuery('page', '无效页码').isInt().gte(1).withMessage('必须是大于1的整数');
  req.checkQuery('size', '无效size').isInt().gte(1).withMessage('必须是大于1的整数');
  var errors = req.validationErrors();
  if (errors) {
    return res.json({
      code: 400,
      message: '参数有误',
      formInvalids: errors
    });
  }

  NoteService.countNotes(function (err, count) {
    if (err) {
      return res.json({
        code: 500,
        message: '系统内部错误'
      });
    }

    var step2skip = size * (page - 1);
    var _nomore = count <= step2skip;
    var total = count && Math.ceil(count / size);
    if (_nomore) {
      return res.json({
        code: 200,
        message: '访问成功',
        list: [],
        totalPage: total
      });
    } else {
      NoteService.findNotes(
          {owner: _userId},
          {created: 'desc'},
          step2skip,
          size,
          function (err, notes) {
            if (err) {
              console.log('/noteApi/tags/page error:', err);
              res.json({
                code: 500,
                message: '系统内部错误'
              });
            } else {
              res.json({
                code: 200,
                message: '访问成功',
                list: notes,
                totalPage: total
              });
            }
          });
    }

  });

});
