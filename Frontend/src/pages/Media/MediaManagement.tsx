import { useEffect, useState } from 'react';
import { Upload, FileText, Image, Video, Trash2, AlertCircle, CheckCircle } from 'lucide-react';

type MediaPost = {
  id: string;
  caption: string;
  url: string;
  type: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

type BlogPost = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

type Banner = {
  url: string;
  uploadedAt: string;
};



// Configure your backend base URL here
const API_BASE_URL = 'http://localhost:5000'; // Update this to match your Flask server URL

const MediaManagement = () => {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [mediaList, setMediaList] = useState<MediaPost[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const [blogTitle, setBlogTitle] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [isBlogUploading, setIsBlogUploading] = useState(false);

  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [isBannerUploading, setIsBannerUploading] = useState(false);

  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
const [banner, setBanner] = useState<Banner | null>(null);

useEffect(() => {
  
  fetchActiveBlogs();
  fetchActiveBanner();
}, []);


const fetchActiveBlogs = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/blog/active`);
    const text = await res.text();  // TEMP: inspect raw response
    console.log('Raw response:', text);
    const data = JSON.parse(text); // will fail if HTML
    //const data = await res.json();
    setBlogPosts(data);
  } catch (err) {
    console.error('Error fetching blogs:', err);
  }
};

const fetchActiveBanner = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/banner/active`);
    const data = await res.json();
    setBanner(data?.url ? data : null);
  } catch (err) {
    console.error('Error fetching banner:', err);
  }
};


const deleteBlog = async (id: string) => {
  if (!confirm('Are you sure you want to delete this blog post?')) return;

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/blog/delete/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Delete failed');
    }

    const result = await response.json();
    showNotification('success', result.message || 'Blog post deleted');
    await fetchActiveBlogs();
  } catch (error) {
    console.error('Error deleting blog:', error);
    showNotification('error', error instanceof Error ? error.message : 'Failed to delete blog');
  }
};


const deleteBanner = async () => {
  
  if (!confirm('Are you sure you want to delete the banner?')) return;

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/banner/delete`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Delete failed');
    }

    const result = await response.json();
    showNotification('success', result.message || 'Banner deleted');
    await fetchActiveBanner();
  } catch (error) {
    console.error('Error deleting banner:', error);
    showNotification('error', error instanceof Error ? error.message : 'Failed to delete banner');
  }
};


  useEffect(() => {
    fetchMedia();
  }, []);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchMedia = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/media/active`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMediaList(data);
    } catch (error) {
      console.error('Error fetching media:', error);
      showNotification('error', 'Failed to fetch media');
    }
  };

  const uploadMedia = async () => {
    if (!file) {
      showNotification('error', 'Please select a file');
      return;
    }
    
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('caption', caption);
      formData.append('type', mediaType);

      const response = await fetch(`${API_BASE_URL}/api/v1/upload/media`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      showNotification('success', result.message || 'Media uploaded successfully!');
      
      // Refresh media list and reset form
      await fetchMedia();
      setFile(null);
      setCaption('');
      
      // Reset file input
      const fileInput = document.getElementById('media-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      console.error('Error uploading media:', error);
      showNotification('error', error instanceof Error ? error.message : 'Failed to upload media');
    } finally {
      setIsUploading(false);
    }
  };

  const uploadBlog = async () => {
    if (!blogContent.trim()) {
      showNotification('error', 'Please enter blog content');
      return;
    }
    
    setIsBlogUploading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/upload/blog`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: blogTitle,
          content: blogContent,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Blog upload failed');
      }

      const result = await response.json();
      showNotification('success', result.message || 'Blog post uploaded successfully!');
      
      // Reset form
      setBlogTitle('');
      setBlogContent('');
      
    } catch (error) {
      console.error('Error uploading blog:', error);
      showNotification('error', error instanceof Error ? error.message : 'Failed to upload blog post');
    } finally {
      setIsBlogUploading(false);
    }
  };

  const uploadBanner = async () => {
    if (!bannerFile) {
      showNotification('error', 'Please select a banner image');
      return;
    }
    
    setIsBannerUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', bannerFile);

      const response = await fetch(`${API_BASE_URL}/api/v1/upload/banner`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Banner upload failed');
      }

      const result = await response.json();
      showNotification('success', result.message || 'Promotional banner uploaded successfully!');
      
      // Reset form
      setBannerFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('banner-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      console.error('Error uploading banner:', error);
      showNotification('error', error instanceof Error ? error.message : 'Failed to upload banner');
    } finally {
      setIsBannerUploading(false);
    }
  };

  const deleteMedia = async (id: string) => {
    if (!confirm('Are you sure you want to delete this media?')) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/media/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Delete failed');
      }

      const result = await response.json();
      showNotification('success', result.message || 'Media deleted successfully');
      
      // Refresh media list
      await fetchMedia();
      
    } catch (error) {
      console.error('Error deleting media:', error);
      showNotification('error', error instanceof Error ? error.message : 'Failed to delete media');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Media Management Dashboard</h1>
          <p className="mt-2 text-gray-600">Upload and manage your media content, blog posts, and promotional banners</p>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
            notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span>{notification.message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Media Upload Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Image className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Upload Media</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Media Type
                </label>
                <select 
                  value={mediaType}
                  onChange={(e) => setMediaType(e.target.value as 'image' | 'video')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {mediaType === 'image' ? 'Image' : 'Video'} File
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                  <input 
                    type="file" 
                    accept={mediaType === 'image' ? 'image/*' : 'video/*'}
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="media-upload"
                  />
                  <label htmlFor="media-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {file ? file.name : `Click to upload ${mediaType}`}
                    </p>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Caption
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Enter a caption for your media..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <button
                onClick={uploadMedia}
                disabled={isUploading || !file}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isUploading ? 'Uploading...' : 'Upload Media'}
              </button>
            </div>
          </div>

          {/* Blog Upload Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <FileText className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Create Blog Post</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blog Title
                </label>
                <input
                  type="text"
                  value={blogTitle}
                  onChange={(e) => setBlogTitle(e.target.value)}
                  placeholder="Enter blog title..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blog Content
                </label>
                <textarea
                  value={blogContent}
                  onChange={(e) => setBlogContent(e.target.value)}
                  placeholder="Write your blog content here..."
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
              </div>

              <button
                onClick={uploadBlog}
                disabled={isBlogUploading || !blogContent.trim()}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isBlogUploading ? 'Publishing...' : 'Publish Blog Post'}
              </button>
            </div>
          </div>
        </div>

        {/* Promotional Banner Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Image className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">Promotional Banner</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Banner Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-purple-400 transition-colors">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setBannerFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="banner-upload"
                />
                <label htmlFor="banner-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {bannerFile ? bannerFile.name : 'Click to upload banner image'}
                  </p>
                </label>
              </div>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={uploadBanner}
                disabled={isBannerUploading || !bannerFile}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isBannerUploading ? 'Uploading...' : 'Upload Banner'}
              </button>
            </div>
          </div>
        </div>

        {/* Active Media Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Video className="w-6 h-6 text-orange-600" />
              <h2 className="text-xl font-semibold text-gray-900">Active Media Posts</h2>
            </div>
            <span className="bg-orange-100 text-orange-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
              {mediaList.length} posts
            </span>
          </div>
          
          {mediaList.length === 0 ? (
            <div className="text-center py-12">
              <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No media posts yet. Upload your first media above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mediaList.map((media) => (
                <div key={media.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-video bg-gray-100 flex items-center justify-center">
                    {media.type === 'image' ? (
                      <img 
                        src={media.url} 
                        alt={media.caption} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video 
                        src={media.url} 
                        controls 
                        className="w-full h-full object-cover"
                        preload="metadata"
                      />
                    )}
                  </div>
                  
                  <div className="p-4">
                    <p className="text-sm text-gray-800 mb-3 line-clamp-2">
                      {media.caption}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        media.type === 'image' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {media.type === 'image' ? 'Image' : 'Video'}
                      </span>
                      
                      <button
                        onClick={() => deleteMedia(media.id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded-md hover:bg-red-50 transition-colors"
                        title="Delete media"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Blog Posts</h2>
          {blogPosts.length === 0 ? (
            <p className="text-gray-500">No blog posts yet.</p>
          ) : (
            <ul className="space-y-4">
            {blogPosts.map((blog) => (
              <li key={blog.id} className="border border-gray-100 rounded p-4 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold text-gray-800">{blog.title}</h3>
                  <button
                    onClick={() => deleteBlog(blog.id)}
                    className="text-red-600 hover:text-red-800 p-1 rounded-md hover:bg-red-50 transition-colors"
                    title="Delete blog"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-gray-700 text-sm">{blog.content.slice(0, 150)}...</p>
              </li>
            ))}
            </ul>
          )}
        </div>

        {banner && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Current Promotional Banner</h2>
              <button
                onClick={deleteBanner}
                className="text-red-600 hover:text-red-800 p-1 rounded-md hover:bg-red-50 transition-colors"
                title="Delete banner"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <img src={banner.url} alt="Promotional Banner" className="w-full rounded-md border border-gray-100 shadow" />
          </div>
        )}
        
      </div>
    </div>
  );
};

export default MediaManagement;


