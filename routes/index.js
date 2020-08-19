var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  let $examdetailsId = 22;
  let $studentId = 82;

  let $exam_details_query = `
    SELECT ed.*,'${$studentId}' AS studentId, s.subjectName  ,s.subjectName  ,s.subjectId subject_id,e.examTitle ,e.examId exammId, rd.startTime AS started_time FROM examdetails ed 
        LEFT JOIN exam e ON(e.examId=ed.examId)
        LEFT JOIN subject s ON(ed.subjectId=s.subjectId)
        LEFT JOIN resultsdetails rd ON(rd.examId = e.examId)
    WHERE ed.examdetailsId = '${$examdetailsId}'
  `;

  let data = {};
  global._mysql.query($exam_details_query, function (error, results, field){
    let examdetails = data.examdetails=results[0];
    //get questions
    let $exam_questions =`
    SELECT DISTINCT q.*, IF (qa.answerSelected!='', qa.answerSelected, '') as answer  FROM  question q
    LEFT JOIN questionanswared qa ON(q.questionId = qa.questionId AND qa.examId=${examdetails.examId} AND qa.studentId='${$studentId}')
    WHERE q.examdetailsId='${$examdetailsId}'
    `;
    global._mysql.query($exam_questions, function (error, results, fields){
      let questions = data.questions = results;
      //send to client
      res.render('index', {
        title: 'WTOS Examination System' ,
        examdetails : examdetails,
        questions:questions
      });
    })
  });


});




module.exports = router;
