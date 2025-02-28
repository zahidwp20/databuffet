const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

async function deleteByTag(tag, next_cursor) {
  const result = await cloudinary.api.delete_resources_by_tag(tag, { next_cursor });
  if (result && result.partial) {
    await deleteByTag(tag, result.next_cursor);
  }
}
module.exports = { cloudinary, deleteByTag };
