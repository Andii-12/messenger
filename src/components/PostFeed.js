import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Post from './Post';
import { Search as SearchIcon } from 'lucide-react';
import NewPostModal from './NewPostModal';
import UserSearchModal from './UserSearchModal';

const PostFeed = ({ user, settingsModalOpen, onStartChat }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showUserSearchModal, setShowUserSearchModal] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getPosts();
      if (res.success) setPosts(res.data.posts);
      else setError(res.message || 'Алдаа гарлаа');
    } catch (e) {
      setError('Алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto w-full p-4">
      {/* Sticky New Post UI */}
      <div className="sticky top-0 z-20 mb-6 bg-background dark:bg-background-dark/95 backdrop-blur-sm rounded-2xl shadow p-4 flex items-center gap-3 border border-border dark:border-border-dark">
        <input
          className="flex-1 bg-muted dark:bg-muted-dark rounded-full px-4 py-2 border border-border dark:border-border-dark focus:bg-white dark:focus:bg-background-dark focus:border-primary dark:focus:border-primary-dark focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary-dark/20 transition placeholder:text-secondary dark:placeholder:text-secondary-dark text-base cursor-pointer"
          placeholder="Юу бодож байна?"
          onFocus={() => setShowModal(true)}
          readOnly
        />
        <button
          className="ml-2 px-6 py-2 bg-primary dark:bg-primary-dark text-primary-dark dark:text-primary rounded-full font-semibold hover:bg-primary/90 dark:hover:bg-primary-dark/90 transition"
          onClick={() => setShowModal(true)}
        >
          Постлох
        </button>
        <button
          className="ml-2 p-2 bg-muted dark:bg-muted-dark text-primary dark:text-primary-dark rounded-full hover:bg-primary/10 dark:hover:bg-primary-dark/10 transition flex items-center justify-center"
          title="Хэрэглэгч хайх"
          onClick={() => setShowUserSearchModal(true)}
        >
          <SearchIcon className="w-5 h-5" />
        </button>
      </div>
      {showUserSearchModal && (
        <UserSearchModal 
          onClose={() => setShowUserSearchModal(false)} 
          currentUser={user}
          onStartChat={onStartChat}
        />
      )}
      {showModal && (
        <NewPostModal user={user} onClose={() => setShowModal(false)} onPostCreated={fetchPosts} />
      )}
      {/* Posts Feed */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary dark:border-primary-dark"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : posts.length === 0 ? (
        <div className="text-center text-secondary dark:text-secondary-dark">Пост байхгүй байна</div>
      ) : (
        <div className="space-y-6">
          {posts.map(post => (
            <Post 
              key={post._id} 
              post={post} 
              user={user} 
              onPostUpdate={fetchPosts} 
              settingsModalOpen={settingsModalOpen}
              onStartChat={onStartChat}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostFeed; 