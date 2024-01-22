const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Kết nối tới cơ sở dữ liệu MongoDB
mongoose.connect('mongodb://localhost:27017/your_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Định nghĩa mô hình sản phẩm
const Product = mongoose.model('Product', {
  name: String,
  price: Number,
});

app.use(bodyParser.json());

// Dịch vụ thêm sản phẩm (bất đồng bộ)
app.post('/add', async (req, res) => {
  try {
    const { name, price } = req.body;
    const product = new Product({ name, price });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Dịch vụ xoá sản phẩm (bất đồng bộ)
app.delete('/delete/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    await Product.findByIdAndDelete(productId);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Dịch vụ sửa sản phẩm (bất đồng bộ)
app.put('/update/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    const { name, price } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { name, price },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Dịch vụ tìm kiếm sản phẩm (bất đồng bộ)
app.get('/search/:productName', async (req, res) => {
  try {
    const productName = req.params.productName;
    const products = await Product.find({ name: { $regex: productName, $options: 'i' } });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Khởi động máy chủ
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
