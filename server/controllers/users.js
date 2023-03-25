const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user')

const signin = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const oldUser = await User.findOne({ email });
  
      if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });
  
      const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);
  
      if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

      
  
      const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, 'test', { expiresIn: "7d" });
  
      res.status(200).json({ result: oldUser, token });
    } catch (err) {
      res.status(500).json({ message: "Something went wrong" });
    }
  };

  const signup = async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    
    try {
      const oldUser = await User.findOne({ email });
      
      if (oldUser) return res.status(400).json({ message: "User already exists" });
  
      const hashedPassword = await bcrypt.hash(password, 12);
  
      const result = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` });
  
      const token = jwt.sign( { email: result.email, id: result._id }, 'test', { expiresIn: "7d" } );
  
      res.status(201).json({ result, token });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
      
      console.log(error);
    }
  };

  const getUsers = async(req,res) =>{
    
    const {search} = req.query;
    
    
    try {
        
       const userPattern =  new RegExp("^"+search)

       const users = await User.find({email:{$regex:userPattern}});
       
        
       res.json({ data: users });
    } catch (e) {
        res.status(404).json({ message: e.message });
    }
    
  }

  const getUser = async(req,res) =>{
    
    const {id} = req.params;
    
    
    try {
        
       

      const user = await User.findById(id);
       
        
      res.status(200).json(user);
    } catch (e) {
        res.status(404).json({ message: e.message });
    }
    
  }

module.exports = {signin , signup , getUsers , getUser}