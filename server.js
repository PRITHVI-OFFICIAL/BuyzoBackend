const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const PORT = 10000;
const dotenv=require('dotenv');
// dotenv.config({ path: './config.env' });
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const DB="mongodb+srv://prithviofficial02:gekTxVbhMnoiRdrP@cluster0.4j68sxj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(DB)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB', err));


app.get('/check', (req, res) => {
    res.send('Ecommerce Backend Running');
});


const productSchema = new mongoose.Schema({
  id: Number,
  title: String,
  price: Number,
  description: String,
  category: String,
  image: String,
  rating: {
    rate: Number,
    count: Number
  }
});


const Products = mongoose.model('Product', productSchema,"Products");

const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    }
  });
  
  const User = mongoose.model('User', userSchema,'users');



  app.post('/signup', async (req, res) => {
    try {
      const { username, password } = req.body;
     
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      const newUser = new User({ username, password});
      await newUser.save();
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      const user = await User.findOne({ username });
      console.log(user);
      if (!user) {
        return res.status(400).json({ message: 'Invalid username or password' });
      }

      
      if (username!=user.username || password!=user.password) {
        return res.status(400).json({ message: 'Invalid username or password' });
      }
      res.json({ message: 'Login successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });


app.get('/products', async (req, res) => {
  try {
    const products = await Products.find();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/products/:id', async (req, res) => {
    try {
      const product = await Products.findOne({ id: req.params.id });
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
