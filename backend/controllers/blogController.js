import Blog from '../models/Blog.js';

const getBlogs = async (req, res) => {
  const blogs = await Blog.find({}).sort({ createdAt: -1 });
  res.json(blogs);
};

const getBlogById = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (blog) {
    res.json(blog);
  } else {
    res.status(404).json({ message: 'Blog not found' });
  }
};

const createBlog = async (req, res) => {
  const { heading, description, image, content } = req.body;
  const blog = new Blog({
    user: req.user._id,
    heading,
    description,
    image: image || `https://source.unsplash.com/random/800x600?sig=${Date.now()}`,
    content,
  });
  const createdBlog = await blog.save();
  res.status(201).json(createdBlog);
};

const deleteBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (blog) {
    // Optional: Add ownership check
    if (blog.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    await Blog.deleteOne({ _id: blog._id });
    res.json({ message: 'Blog removed' });
  } else {
    res.status(404).json({ message: 'Blog not found' });
  }
};

export { getBlogs, getBlogById, createBlog, deleteBlog };