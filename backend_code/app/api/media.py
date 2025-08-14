# from flask import Blueprint, request, jsonify
# from app.firebase import  realtime_db
# import uuid
# from datetime import datetime, timezone
# import cloudinary.uploader
# from app.cloudinary_config import cloudinary

# media_bp = Blueprint("media_bp", __name__)

# @media_bp.route('/api/v1/upload/media', methods=['POST'])
# def upload_media():
#     file = request.files.get('file')
#     caption = request.form.get('caption')
#     media_type = request.form.get('type')  

#     if not file or not media_type:
#         return jsonify({'error': 'File and type are required'}), 400

#     try:
#         # Upload to Cloudinary
#         result = cloudinary.uploader.upload(file, resource_type="auto")

#         media_id = str(uuid.uuid4())
#         now = datetime.now(timezone.utc).isoformat()

#         metadata = {
#             'id': media_id,
#             'type': media_type,
#             'caption': caption,
#             'url': result["secure_url"],
#             'active': True,
#             'createdAt': now,
#             'updatedAt': now
#         }

#         # Store metadata in Firebase
#         realtime_db.child("media_posts").child(media_id).set(metadata)

#         return jsonify({'message': 'Uploaded successfully', 'data': metadata})
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500
    

# @media_bp.route('/api/v1/upload/blog', methods=['POST'])
# def upload_blog():
#     content = request.json.get('content')
#     title = request.json.get('title')
#     blog_id = str(uuid.uuid4())

#     if not content:
#         return jsonify({'error': 'Content is required'}), 400

#     now = datetime.now(timezone.utc).isoformat()

#     metadata = {
#         'id': blog_id,
#         'title': title,
#         'content': content,
#         'active': True,  
#         'createdAt': now,
#         'updatedAt': now
#     }

#     realtime_db.child("blog_posts").child(blog_id).set(metadata)

#     return jsonify({'message': 'Blog uploaded successfully', 'data': metadata})


# @media_bp.route('/api/v1/upload/banner', methods=['POST'])
# def upload_banner():
#     file = request.files.get('file')

#     if not file:
#         return jsonify({'error': 'File is required'}), 400

#     try:
#         # Upload to Cloudinary
#         result = cloudinary.uploader.upload(file, resource_type="auto")

#         now = datetime.now(timezone.utc).isoformat()

#         banner_data = {
#             'url': result["secure_url"],
#             'active': True, 
#             'uploadedAt': now
#         }

#         realtime_db.child("promo_banner").set(banner_data)

#         return jsonify({'message': 'Banner uploaded successfully', 'data': banner_data})
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500


# @media_bp.route('/api/v1/media/active', methods=['GET'])
# def list_active_media():
#     media_posts = realtime_db.child("media_posts").get()
#     if media_posts:
#         active = [v for v in media_posts.values() if v.get('active')]
#         return jsonify(active)
#     return jsonify([])


# @media_bp.route('/api/v1/media/delete/<media_id>', methods=['DELETE'])
# def delete_media(media_id):
#     media_data = realtime_db.child("media_posts").child(media_id).get()
#     if not media_data:
#         return jsonify({'error': 'Media not found'}), 404

#     try:
#         file_url = media_data.get('url')
#         blob_name = file_url.split("/")[-1].split("?")[0]
#         blob = bucket.blob(f"media_uploads/{blob_name}")
#         blob.delete()
#     except Exception as e:
#         pass 

#     realtime_db.child("media_posts").child(media_id).delete()
#     return jsonify({'message': 'Media deleted successfully'})


from flask import Blueprint, request, jsonify
from app.firebase import  realtime_db
import uuid
from datetime import datetime, timezone
import cloudinary.uploader
from app.cloudinary_config import cloudinary

media_bp = Blueprint("media_bp", __name__)

@media_bp.route('/api/v1/upload/media', methods=['POST'])
def upload_media():
    file = request.files.get('file')
    caption = request.form.get('caption')
    media_type = request.form.get('type')  

    if not file or not media_type:
        return jsonify({'error': 'File and type are required'}), 400

    try:
        # Upload to Cloudinary
        result = cloudinary.uploader.upload(file, resource_type="auto")

        media_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc).isoformat()

        metadata = {
            'id': media_id,
            'type': media_type,
            'caption': caption,
            'url': result["secure_url"],
            'active': True,
            'createdAt': now,
            'updatedAt': now
        }

        # Store metadata in Firebase
        realtime_db.child("media_posts").child(media_id).set(metadata)

        return jsonify({'message': 'Uploaded successfully', 'data': metadata})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@media_bp.route('/api/v1/upload/blog', methods=['POST'])
def upload_blog():
    content = request.json.get('content')
    title = request.json.get('title')
    blog_id = str(uuid.uuid4())

    if not content:
        return jsonify({'error': 'Content is required'}), 400

    now = datetime.now(timezone.utc).isoformat()

    metadata = {
        'id': blog_id,
        'title': title,
        'content': content,
        'active': True,  
        'createdAt': now,
        'updatedAt': now
    }

    realtime_db.child("blog_posts").child(blog_id).set(metadata)

    return jsonify({'message': 'Blog uploaded successfully', 'data': metadata})


@media_bp.route('/api/v1/upload/banner', methods=['POST'])
def upload_banner():
    file = request.files.get('file')

    if not file:
        return jsonify({'error': 'File is required'}), 400

    try:
        # Upload to Cloudinary
        result = cloudinary.uploader.upload(file, resource_type="auto")

        now = datetime.now(timezone.utc).isoformat()

        banner_data = {
            'url': result["secure_url"],
            'active': True, 
            'uploadedAt': now
        }

        realtime_db.child("promo_banner").set(banner_data)

        return jsonify({'message': 'Banner uploaded successfully', 'data': banner_data})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@media_bp.route('/api/v1/media/active', methods=['GET'])
def list_active_media():
    media_posts = realtime_db.child("media_posts").get()
    if media_posts:
        active = [v for v in media_posts.values() if v.get('active')]
        return jsonify(active)
    return jsonify([])


@media_bp.route('/api/v1/media/delete/<media_id>', methods=['DELETE'])
def delete_media(media_id):
    media_data = realtime_db.child("media_posts").child(media_id).get()
    if not media_data:
        return jsonify({'error': 'Media not found'}), 404

    try:
        file_url = media_data.get('url')
        blob_name = file_url.split("/")[-1].split("?")[0]
        blob = bucket.blob(f"media_uploads/{blob_name}")
        blob.delete()
    except Exception as e:
        pass 

    realtime_db.child("media_posts").child(media_id).delete()
    return jsonify({'message': 'Media deleted successfully'})


@media_bp.route('/api/v1/blog/active', methods=['GET'])
def list_active_blogs():
  
    blog_posts = realtime_db.child("blog_posts").get()
    if blog_posts:
        active = [v for v in blog_posts.values() if v.get('active')]
        return jsonify(active)
    return jsonify([])

@media_bp.route('/api/v1/banner/active', methods=['GET'])
def get_active_banner():
   
    banner_data = realtime_db.child("promo_banner").get()
    if banner_data and banner_data.get('active'):
        return jsonify(banner_data)
    return jsonify({})

@media_bp.route('/blog/delete/<blog_id>', methods=['DELETE'])
def delete_blog(blog_id):
    blog_data = realtime_db.child("blog_posts").child(blog_id).get()
    if not blog_data:
        return jsonify({'error': 'Blog post not found'}), 404

    realtime_db.child("blog_posts").child(blog_id).delete()
    return jsonify({'message': 'Blog post deleted successfully'})

@media_bp.route('/banner/delete', methods=['DELETE'])
def delete_banner():
    banner_data = realtime_db.child("promo_banner").get()
    if not banner_data:
        return jsonify({'error': 'No banner found'}), 404

    realtime_db.child("promo_banner").delete()
    return jsonify({'message': 'Banner deleted successfully'})
