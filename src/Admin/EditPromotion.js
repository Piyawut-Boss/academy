import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal } from 'antd';
import './EditPromotion.css';

function EditPromotion() {
  const [promotions, setPromotions] = useState([]);
  const [promotionTitle, setPromotionTitle] = useState('');
  const [promotionDescription, setPromotionDescription] = useState('');
  const [promotionImage, setPromotionImage] = useState('');
  const [promotionCategories, setPromotionCategories] = useState([]);  // สำหรับเก็บ categories
  const [isEditing, setIsEditing] = useState(false);
  const [editingPromotionId, setEditingPromotionId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:1337/api/promotions?populate=*')
      .then(response => {
        setPromotions(response.data.data);
      })
      .catch(error => console.error('Error fetching promotions:', error));
  }, []);

  const handleEdit = (promotionId) => {
    const selectedPromotion = promotions.find(promo => promo.id === promotionId);
    if (selectedPromotion) {
      setPromotionTitle(selectedPromotion.PromitionName);
      setPromotionDescription(selectedPromotion.Discription);
      setPromotionImage(selectedPromotion.PromotePromo?.url || '');
      setPromotionCategories(selectedPromotion.categories.map(cat => cat.Category) || []);  // โหลด categories
      setIsEditing(true);
      setEditingPromotionId(promotionId);
    }
  };

  const handleSave = () => {
    const updatedPromotion = {
      PromitionName: promotionTitle,
      Discription: promotionDescription,
      PromotePromo: promotionImage,
      categories: promotionCategories,  // ส่ง categories กลับไปด้วย
    };

    axios.put(`http://localhost:1337/api/promotions/${editingPromotionId}`, { data: updatedPromotion })
      .then(response => {
        alert('Promotion updated successfully!');
        setIsEditing(false);
        setEditingPromotionId(null);
      })
      .catch(error => console.error('Error updating promotion:', error));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingPromotionId(null);
    setPromotionTitle('');
    setPromotionDescription('');
    setPromotionImage('');
    setPromotionCategories([]);  // ล้าง categories
  };

  const handleDelete = (promotionId) => {
    axios.delete(`http://localhost:1337/api/promotions/${promotionId}`)
      .then(response => {
        alert('Promotion deleted successfully!');
        setPromotions(promotions.filter(promo => promo.id !== promotionId));
      })
      .catch(error => console.error('Error deleting promotion:', error));
  };

  const handleImageClick = (imageUrl) => {
    setModalImage(imageUrl);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setModalImage('');
  };

  if (!promotions.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="edit-promotion-container">
      <h1>Edit Promotion</h1>
      <div className="edit-promotion-table">
        <div className="edit-promotion-table-header">
          <div className="edit-promotion-table-row">
            <div className="edit-promotion-table-cell">Title</div>
            <div className="edit-promotion-table-cell">Description</div>
            <div className="edit-promotion-table-cell">Image</div>
            <div className="edit-promotion-table-cell">Categories</div> {/* เพิ่มคอลัมน์ Categories */}
            <div className="edit-promotion-table-cell">Actions</div>
          </div>
        </div>
        <div className="edit-promotion-table-body">
          {promotions.map(promo => (
            <div key={promo.id} className="edit-promotion-table-row">
              <div className="edit-promotion-table-cell">
                {isEditing && editingPromotionId === promo.id ? (
                  <input
                    type="text"
                    value={promotionTitle}
                    onChange={(e) => setPromotionTitle(e.target.value)}
                    className="select-input"
                  />
                ) : (
                  promo.PromitionName
                )}
              </div>
              <div className="edit-promotion-table-cell">
                {isEditing && editingPromotionId === promo.id ? (
                  <textarea
                    value={promotionDescription}
                    onChange={(e) => setPromotionDescription(e.target.value)}
                    className="select-input"
                  />
                ) : (
                  promo.Discription
                )}
              </div>
              <div className="edit-promotion-table-cell">
                {isEditing && editingPromotionId === promo.id ? (
                  <input
                    type="text"
                    value={promotionImage}
                    onChange={(e) => setPromotionImage(e.target.value)}
                    className="select-input"
                  />
                ) : (
                  <img
                    src={`http://localhost:1337${promo.PromotePromo?.url}`}
                    alt="Promotion"
                    className="promotion-image"
                    width="100"
                    height="100"
                    onClick={() => handleImageClick(`http://localhost:1337${promo.PromotePromo?.url}`)}
                    style={{ cursor: 'pointer' }}
                  />
                )}
              </div>
              <div className="edit-promotion-table-cell">
                {isEditing && editingPromotionId === promo.id ? (
                  <input
                    type="text"
                    value={promotionCategories.join(', ')}  // แสดง categories ที่แก้ไขได้
                    onChange={(e) => setPromotionCategories(e.target.value.split(','))}
                    className="select-input"
                  />
                ) : (
                  promo.categories.map((cat, index) => (
                    <div key={index}>{cat.Category}</div> // แสดงชื่อ category
                  ))
                )}
              </div>
              <div className="edit-promotion-table-cell">
                {isEditing && editingPromotionId === promo.id ? (
                  <div className="button-group">
                    <button className="edit-promotion-button" onClick={handleSave}>Save</button>
                    <button className="edit-promotion-button cancel" onClick={handleCancel}>Cancel</button>
                  </div>
                ) : (
                  <div className="button-group">
                    <button className="edit-promotion-button" onClick={() => handleEdit(promo.id)}>Edit</button>
                    <button className="edit-promotion-button delete" onClick={() => handleDelete(promo.id)}>Delete</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal visible={isModalVisible} footer={null} onCancel={handleModalClose}>
        <img src={modalImage} alt="Promotion" style={{ width: '100%' }} />
      </Modal>
    </div>
  );
}

export default EditPromotion;