
//for further development i wanted to add logout here as seperate route file 

const express=require('express');
const router=express.Router();


router.get('/logout',(req,res,next)=> {
    req.logout(function(err) {
        if (err) {return next(err);}
        res.redirect('/');
    });
});

module.exports=router;
