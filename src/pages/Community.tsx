import React, { useState, useEffect } from 'react';

interface Post {
  id: number;
  user: string;
  avatar?: string;
  text: string;
  category: 'tip' | 'question' | 'support' | 'review' | 'announcement';
  tags: string[];
  createdAt: Date;
  likes: number;
  comments: Comment[];
  isLiked: boolean;
  isFollowing?: boolean;
  location?: string;
  images?: string[];
  accessibility_level?: 'beginner' | 'intermediate' | 'expert';
}

interface Comment {
  id: number;
  user: string;
  avatar?: string;
  text: string;
  createdAt: Date;
  likes: number;
  isLiked: boolean;
}

interface User {
  id: string;
  name: string;
  avatar?: string;
  badges: string[];
  helpfulTips: number;
  joinDate: Date;
}

const Community: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Post['category']>('tip');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser] = useState<User>({
    id: 'current-user',
    name: 'You',
    badges: ['Helper', 'Contributor'],
    helpfulTips: 15,
    joinDate: new Date('2024-01-15')
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/community/posts');
      const data = await response.json();
      
      const enhancedPosts: Post[] = [
        {
          id: 1,
          user: 'AccessibilityExpert',
          avatar: '👩‍💼',
          text: 'Pro tip: When visiting a new restaurant, call ahead to ask about their accessibility features. Most places are happy to help and it saves you time and potential disappointment!',
          category: 'tip',
          tags: ['restaurants', 'planning', 'wheelchair'],
          createdAt: new Date(Date.now() - 3600000),
          likes: 23,
          comments: [
            {
              id: 1,
              user: 'WheelchairTraveler',
              text: 'This is so true! I always do this and it has saved me so many awkward situations.',
              createdAt: new Date(Date.now() - 1800000),
              likes: 5,
              isLiked: false
            }
          ],
          isLiked: false,
          location: 'Seattle, WA',
          accessibility_level: 'beginner'
        },
        {
          id: 2,
          user: 'VisionHelper',
          avatar: '👨‍🦯',
          text: 'Question: Has anyone tried the new voice navigation feature in the downtown area? I\'m curious about how accurate the audio descriptions are for street crossings.',
          category: 'question',
          tags: ['navigation', 'audio', 'vision'],
          createdAt: new Date(Date.now() - 7200000),
          likes: 8,
          comments: [
            {
              id: 2,
              user: 'TechSavvy',
              text: 'I tested it last week! It\'s pretty accurate for major intersections, but still working on smaller street corners.',
              createdAt: new Date(Date.now() - 3600000),
              likes: 3,
              isLiked: true
            }
          ],
          isLiked: true,
          location: 'Portland, OR',
          accessibility_level: 'intermediate'
        },
        {
          id: 3,
          user: 'CommunityModerator',
          avatar: '👨‍💻',
          text: '🎉 Welltick Community Update: We now have over 10,000 accessibility reviews from our amazing community! Thank you all for making spaces more accessible for everyone. Keep sharing your experiences!',
          category: 'announcement',
          tags: ['milestone', 'community', 'celebration'],
          createdAt: new Date(Date.now() - 10800000),
          likes: 156,
          comments: [],
          isLiked: false,
          accessibility_level: 'beginner'
        },
        {
          id: 4,
          user: 'PhysioTherapist',
          avatar: '👩‍⚕️',
          text: 'Wellness Wednesday: Remember to take breaks from your devices every 20 minutes. The 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds. Your eyes and posture will thank you! 💪',
          category: 'tip',
          tags: ['wellness', 'eyes', 'posture', 'health'],
          createdAt: new Date(Date.now() - 14400000),
          likes: 34,
          comments: [
            {
              id: 3,
              user: 'OfficeWorker',
              text: 'I set a timer for this! Game changer for my daily eye strain.',
              createdAt: new Date(Date.now() - 7200000),
              likes: 2,
              isLiked: false
            }
          ],
          isLiked: true,
          accessibility_level: 'beginner'
        },
        {
          id: 5,
          user: 'HearingAdvocate',
          avatar: '👂',
          text: 'Just discovered that the new movie theater downtown has excellent assistive listening devices and closed captioning. Staff was super helpful and knowledgeable. Highly recommend! 🎬',
          category: 'review',
          tags: ['entertainment', 'hearing', 'movies', 'review'],
          createdAt: new Date(Date.now() - 18000000),
          likes: 19,
          comments: [],
          isLiked: false,
          location: 'Downtown Theater District',
          accessibility_level: 'intermediate'
        },
        {
          id: 6,
          user: 'MentalHealthSupport',
          avatar: '🧠',
          text: 'Reminder: It\'s okay to have difficult days. If you\'re struggling, reach out to someone you trust or use the emergency features in the app. You\'re not alone in this journey. 💙',
          category: 'support',
          tags: ['mentalhealth', 'support', 'community'],
          createdAt: new Date(Date.now() - 21600000),
          likes: 89,
          comments: [
            {
              id: 4,
              user: 'GratefulUser',
              text: 'Thank you for this. Really needed to hear it today.',
              createdAt: new Date(Date.now() - 18000000),
              likes: 12,
              isLiked: false
            }
          ],
          isLiked: true,
          accessibility_level: 'beginner'
        }
      ];
      
      setPosts(enhancedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (postId: number) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            isLiked: !post.isLiked 
          }
        : post
    ));
  };

  const handleCommentLike = async (postId: number, commentId: number) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? {
            ...post,
            comments: post.comments.map(comment =>
              comment.id === commentId
                ? {
                    ...comment,
                    likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
                    isLiked: !comment.isLiked
                  }
                : comment
            )
          }
        : post
    ));
  };

  const submitPost = async () => {
    if (!newPost.trim()) return;
    
    const post: Post = {
      id: Date.now(),
      user: currentUser.name,
      avatar: '👤',
      text: newPost,
      category: selectedCategory,
      tags: extractTags(newPost),
      createdAt: new Date(),
      likes: 0,
      comments: [],
      isLiked: false,
      accessibility_level: 'beginner'
    };

    try {
      const response = await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
      });
      
      if (response.ok) {
        setPosts(prev => [post, ...prev]);
        setNewPost('');
        setShowNewPostForm(false);
      }
    } catch (error) {
      console.error('Error posting:', error);
    }
  };

  const extractTags = (text: string): string[] => {
    const hashtags = text.match(/#\w+/g) || [];
    return hashtags.map(tag => tag.slice(1).toLowerCase());
  };

  const getCategoryIcon = (category: Post['category']) => {
    const icons = {
      tip: '💡',
      question: '❓',
      support: '🤝',
      review: '⭐',
      announcement: '📢'
    };
    return icons[category];
  };

  const getCategoryColor = (category: Post['category']) => {
    const colors = {
      tip: '#FFC107',
      question: '#2196F3',
      support: '#4CAF50',
      review: '#FF9800',
      announcement: '#9C27B0'
    };
    return colors[category];
  };

  const getAccessibilityBadgeColor = (level?: string) => {
    const colors = {
      beginner: '#4CAF50',
      intermediate: '#FF9800',
      expert: '#F44336'
    };
    return colors[level as keyof typeof colors] || '#666';
  };

  const filteredPosts = filterCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === filterCategory);

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f8f9fa',
      paddingBottom: '80px'
    }}>
      <div style={{
        padding: '16px',
        background: 'white',
        borderBottom: '1px solid #e0e0e0',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h1 style={{ margin: 0, fontSize: '24px', color: '#333' }}>
            Community
          </h1>
          <button
            onClick={() => setShowNewPostForm(true)}
            style={{
              padding: '8px 16px',
              background: 'linear-gradient(135deg, #007ACC, #00BFA6)',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              fontSize: '14px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            ✏️ New Post
          </button>
        </div>

        
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {[
            { key: 'all', label: 'All', icon: '📋' },
            { key: 'tip', label: 'Tips', icon: '💡' },
            { key: 'question', label: 'Questions', icon: '❓' },
            { key: 'support', label: 'Support', icon: '🤝' },
            { key: 'review', label: 'Reviews', icon: '⭐' },
            { key: 'announcement', label: 'News', icon: '📢' }
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setFilterCategory(key)}
              style={{
                padding: '6px 12px',
                background: filterCategory === key ? '#007ACC' : '#f0f0f0',
                color: filterCategory === key ? 'white' : '#333',
                border: 'none',
                borderRadius: '16px',
                fontSize: '12px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      
      <div style={{ padding: '16px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <div style={{
            background: 'white',
            padding: '12px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#007ACC' }}>2.5k</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Members</div>
          </div>
          <div style={{
            background: 'white',
            padding: '12px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#00BFA6' }}>10.2k</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Reviews</div>
          </div>
          <div style={{
            background: 'white',
            padding: '12px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#FFC107' }}>856</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Tips Shared</div>
          </div>
        </div>

        
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏳</div>
            <div>Loading community posts...</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '20px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                  border: `2px solid ${getCategoryColor(post.category)}20`
                }}
              >
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #007ACC, #00BFA6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px'
                    }}>
                      {post.avatar || '👤'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{post.user}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {post.createdAt.toLocaleDateString()} • {post.createdAt.toLocaleTimeString()}
                      </div>
                      {post.location && (
                        <div style={{ fontSize: '11px', color: '#999' }}>
                          📍 {post.location}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {/* Category Badge */}
                    <span style={{
                      padding: '4px 8px',
                      background: getCategoryColor(post.category),
                      color: 'white',
                      borderRadius: '12px',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px'
                    }}>
                      {getCategoryIcon(post.category)}
                      {post.category.toUpperCase()}
                    </span>
                    
                    {/* Accessibility Level */}
                    {post.accessibility_level && (
                      <span style={{
                        padding: '4px 6px',
                        background: getAccessibilityBadgeColor(post.accessibility_level),
                        color: 'white',
                        borderRadius: '8px',
                        fontSize: '9px',
                        fontWeight: 'bold'
                      }}>
                        {post.accessibility_level.toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>

                
                <div style={{ 
                  fontSize: '14px', 
                  lineHeight: '1.6', 
                  marginBottom: '16px',
                  color: '#333'
                }}>
                  {post.text}
                </div>

                
                {post.tags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        style={{
                          padding: '2px 8px',
                          background: '#e3f2fd',
                          color: '#1976d2',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '500'
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Post Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    <button
                      onClick={() => handleLike(post.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px',
                        color: post.isLiked ? '#e91e63' : '#666',
                        fontSize: '14px'
                      }}
                    >
                      <span>{post.isLiked ? '❤️' : '🤍'}</span>
                      <span>{post.likes}</span>
                    </button>

                    <button
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px',
                        color: '#666',
                        fontSize: '14px'
                      }}
                    >
                      <span>💬</span>
                      <span>{post.comments.length}</span>
                    </button>

                    <button
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px',
                        color: '#666',
                        fontSize: '14px'
                      }}
                    >
                      <span>📤</span>
                      <span>Share</span>
                    </button>
                  </div>

                  <button
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      color: '#666'
                    }}
                  >
                    ⋯
                  </button>
                </div>

                {post.comments.length > 0 && (
                  <div style={{ 
                    marginTop: '16px', 
                    paddingTop: '16px', 
                    borderTop: '1px solid #f0f0f0' 
                  }}>
                    {post.comments.map((comment) => (
                      <div
                        key={comment.id}
                        style={{
                          display: 'flex',
                          gap: '12px',
                          marginBottom: '12px',
                          padding: '12px',
                          background: '#f8f9fa',
                          borderRadius: '12px'
                        }}
                      >
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: '#ddd',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          flexShrink: 0
                        }}>
                          {comment.avatar || '👤'}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            marginBottom: '4px'
                          }}>
                            <div style={{ fontWeight: 'bold', fontSize: '12px' }}>
                              {comment.user}
                            </div>
                            <div style={{ fontSize: '10px', color: '#666' }}>
                              {comment.createdAt.toLocaleDateString()}
                            </div>
                          </div>
                          <div style={{ fontSize: '12px', marginBottom: '8px' }}>
                            {comment.text}
                          </div>
                          <button
                            onClick={() => handleCommentLike(post.id, comment.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '2px',
                              color: comment.isLiked ? '#e91e63' : '#666',
                              fontSize: '11px'
                            }}
                          >
                            <span>{comment.isLiked ? '❤️' : '🤍'}</span>
                            <span>{comment.likes}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      
      {showNewPostForm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px'
          }}
          onClick={() => setShowNewPostForm(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '20px' }}>Share with Community</h2>
              <button
                onClick={() => setShowNewPostForm(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                ✕
              </button>
            </div>

            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Category
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  { key: 'tip', label: 'Tip', icon: '💡' },
                  { key: 'question', label: 'Question', icon: '❓' },
                  { key: 'support', label: 'Support', icon: '🤝' },
                  { key: 'review', label: 'Review', icon: '⭐' }
                ].map(({ key, label, icon }) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key as Post['category'])}
                    style={{
                      padding: '8px 16px',
                      background: selectedCategory === key ? getCategoryColor(key as Post['category']) : '#f0f0f0',
                      color: selectedCategory === key ? 'white' : '#333',
                      border: 'none',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>{icon}</span>
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                What would you like to share?
              </label>
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder={
                  selectedCategory === 'tip' ? 'Share a helpful accessibility tip...' :
                  selectedCategory === 'question' ? 'Ask the community a question...' :
                  selectedCategory === 'support' ? 'Share encouragement or seek support...' :
                  'Share your experience or review...'
                }
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px',
                  resize: 'vertical',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              />
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                Use #hashtags to help others find your post
              </div>
            </div>

            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Accessibility Level
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { key: 'beginner', label: 'Beginner', desc: 'Basic tips for newcomers' },
                  { key: 'intermediate', label: 'Intermediate', desc: 'For experienced users' },
                  { key: 'expert', label: 'Expert', desc: 'Advanced accessibility knowledge' }
                ].map(({ key, label, desc }) => (
                  <div
                    key={key}
                    style={{
                      flex: 1,
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      background: '#f8f9fa'
                    }}
                  >
                    <div style={{ fontWeight: 'bold', fontSize: '12px' }}>{label}</div>
                    <div style={{ fontSize: '10px', color: '#666' }}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>

          
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowNewPostForm(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#f0f0f0',
                  color: '#333',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Cancel
              </button>
              <button
                onClick={submitPost}
                disabled={!newPost.trim()}
                style={{
                  flex: 2,
                  padding: '12px',
                  background: newPost.trim() ? 'linear-gradient(135deg, #007ACC, #00BFA6)' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: newPost.trim() ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                Share Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;