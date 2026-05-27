const { z } = require('zod');

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(3).max(150),
  message: z.string().min(10).max(5000),
});

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

const projectSchema = z.object({
  title: z.string().min(3).max(120),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  description: z.string().min(20).max(5000),
  techStack: z.array(z.string()).optional(),
  category: z.enum(['Web Development', 'Mobile Development', 'Design', 'Writing', 'web', 'mobile', 'design', 'writing']).optional(),
  images: z.array(z.string().url()).optional(),
  thumbnail: z.string().url().optional(),
  liveUrl: z.string().url().optional(),
  repoUrl: z.string().url().optional(),
  featured: z.boolean().optional(),
});

const bookSchema = z.object({
  title: z.string().min(3).max(120),
  synopsis: z.string().min(20).max(5000),
  genre: z.string().min(2).max(80),
  audience: z.string().max(200).optional(),
  status: z.string().max(50).optional(),
  coverImage: z.string().url().optional(),
  price: z.number().nonnegative().optional(),
  isForSale: z.boolean().optional(),
  isFree: z.boolean().optional(),
});

const blogSchema = z.object({
  title: z.string().min(3).max(200),
  excerpt: z.string().min(20).max(1000),
  content: z.string().min(20).max(20000),
  mediaUrl: z.string().url().optional(),
  mediaType: z.enum(['image', 'video']).optional(),
  tags: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
});

const siteConfigSchema = z.object({
  value: z.union([z.string(), z.number(), z.boolean(), z.array(z.any()), z.record(z.any())]),
  type: z.string().optional(),
});

const socialMetricsSchema = z.object({
  platform: z.string().min(2).max(50),
  followers: z.number().nonnegative(),
  following: z.number().nonnegative().optional(),
  posts: z.number().nonnegative().optional(),
  engagementRate: z.number().nonnegative().optional(),
  likes: z.number().nonnegative().optional(),
  comments: z.number().nonnegative().optional(),
  shares: z.number().nonnegative().optional(),
});

const validate = (schema, data) => {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    const errors = parsed.error.errors.reduce((acc, err) => {
      const path = err.path.join('.') || 'value';
      acc[path] = err.message;
      return acc;
    }, {});
    return { valid: false, errors };
  }
  return { valid: true, data: parsed.data };
};

module.exports = {
  contactSchema,
  authSchema,
  projectSchema,
  bookSchema,
  blogSchema,
  siteConfigSchema,
  socialMetricsSchema,
  validate,
};