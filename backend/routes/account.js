const express = require('express');
const { User,Account} = require("../db");
const { mongoose } = require('mongoose');
const { authMiddleware } = require('../middleware/middleware');
const router = express.Router();

router.get('/balance',authMiddleware,async (req,res)=>{
    const account = await Account.findOne({
        userId : req.userId,
    })
    if (!account) {
        return res.status(404).send({ msg: 'Account not found' });
    }

    res.status(200).send({
        msg : 'balance fetched successfully',
        balance : account.balance
    })
    })



router.post("/transfer",authMiddleware, async (req,res)=>{
    const session = await mongoose.startSession();
    
    session.startTransaction();
    const {to,amount} =req.body;

    const account = await Account.findOne({
        userId: req.userId
    }).session(session);

    if (!account || account.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance"
        });
    }

    const toAccount= await Account.findOne({
        userId: to
    }).session(session);

    if (!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        })
    }

    await Account.updateOne({
        userId: req.userId
    },{
            $inc: {
                balance: -amount
            }
    }).session(session);

    await Account.updateOne({
        userId: to
       
    },{
            $inc:{
                balance : amount
            }
    }).session(session);

    await session.commitTransaction();

    res.json({
        message: "Transfer successful"
    });

})

module.exports = router;