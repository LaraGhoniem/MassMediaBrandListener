const keyword = require("../models/keywordModel");

exports.addKeyword = (req, res) => {
    const Keyword = new keyword(req.body);
    Keyword.save((err, keyword) => {
    if (err) {
        return res.status(400).json({
        err: err.toString(),
        });
    }
    return res.json({
        message: "Keyword created successfully",
        keyword,
    });

    });
};



    exports.view_keywords_by_listener_id = (req, res) => {
        keyword.find({ listener_id: req.params.id }, (err, keywords) => {
            if (err) {
            return res.status(400).json({
                err: err.toString(),
            });
            }
            return res.json({
            keywords,
            });
        });
    };


    exports.deleteKeyword = (req, res) =>{
        const documentId = req.params.id;
        keyword.deleteOne(
          { _id: documentId },
          { $unset: { keyword: "" } },
          function(err, result) {
            if (err) return res.status(500).send(err);
            res.send(result);
          }
        );
      };
     
      exports.editKeyword = (req, res) => {
        const keywordId = req.params.id;
        const updatedKeyword = req.params.set;
      
        // Find the keyword in the database
        keyword.findById(keywordId, (err, foundKeyword) => {
          if (err) {
            return res.status(500).send(err);
          }
      
          if (!foundKeyword) {
            return res.status(404).send('Keyword not found');
          }
      
          // Update the keyword value
          foundKeyword.keyword = updatedKeyword;
      
          // Save the updated keyword
          foundKeyword.save((err, updatedKeyword) => {
            if (err) {
              return res.status(500).send(err);
            }
      
            res.send(updatedKeyword);
          });
        });
      };
      // exports.addKeyword = (req, res) => {
      //   const newKeyword = req.body.keyword;
      
      //   // Create a new keyword object
      //   const keywordObj = new keyword({
      //     keyword: newKeyword
      //   });
      
      //   // Save the new keyword
      //   keywordObj.save((err, savedKeyword) => {
      //     if (err) {
      //       return res.status(500).send(err);
      //     }
      
      //     res.send(savedKeyword);
      //   });
      // };
      
      
      
      
      
     
      
      
      
      
      