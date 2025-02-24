import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Select, message, Input, Button } from 'antd';
import './EditPromotion.css';

function EditPromotion() {
  const [promotions, setPromotions] = useState([]);
  const [promotionTitle, setPromotionTitle] = useState('');
  const [promotionDescription, setPromotionDescription] = useState('');
  const [promotionImage, setPromotionImage] = useState(null);
  const [promotionCategories, setPromotionCategories] = useState([]);
  const [categoriesOptions, setCategoriesOptions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPromotionDocId, setEditingPromotionDocId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [promotionCodeName, setPromotionCodeName] = useState('');
  const [promotionDiscount, setPromotionDiscount] = useState('');


  const token = '026d08263b3ead716ea4e5b42c788650b0ab4a29f5a51f53d20cd1fb7262636f9a326a1cf4e236e1d5f474ae74b2a54fb57eef2413430ec925fc5cb550114572975324b04adfc8bf0f4adf8c5584b3148ea8d7c1729a996e6a56be2a2c7fe3d909a435bca999ca8ac8e6b3ac8ec222b8d840310e8352e5a47e297ad1893ed245';

  useEffect(() => {
    console.log('Fetching promotions...');
    axios.get('http://localhost:1337/api/promotions?populate=*')
      .then(response => {
        console.log('Promotions fetched:', response.data.data);
        setPromotions(response.data.data);
      })
      .catch(error => console.error('Error fetching promotions:', error));

    console.log('Fetching categories...');
  }, []);

  useEffect(() => {
    axios.get('http://localhost:1337/api/categories')
      .then(response => {
        const options = response.data.data.map(cat => ({
          value: cat.id,
          label: cat.Category,
        }));
        setCategoriesOptions(options);
      })
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  const handleEdit = (documentId) => {
    const selectedPromotion = promotions.find(promo => promo.documentId === documentId);
    if (selectedPromotion) {
      setPromotionTitle(selectedPromotion.PromitionName || '');
      setPromotionDescription(selectedPromotion.Discription || '');
      setPromotionImage(selectedPromotion.PromotePromo?.url || null);
      setPromotionCategories(selectedPromotion.categories?.map(cat => cat.id) || []);
      setPromotionCodeName(selectedPromotion.CodeName || '');
      setPromotionDiscount(selectedPromotion.Discount || '');
      setIsEditing(true);
      setEditingPromotionDocId(documentId);
      setIsModalVisible(true);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setPromotionImage(imageUrl);

    handleImageUpload(file);
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('files', file);

    try {
      const uploadResponse = await axios.post('http://localhost:1337/api/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      const uploadedImage = uploadResponse.data[0];
      return uploadedImage.id;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleSave = async () => {
    if (!promotionTitle || !promotionDescription || !promotionCategories.length) {
      message.error('Please fill in all fields and select categories.');
      return;
    }

    let imageId = null;
    if (promotionImage instanceof File) {
      try {
        imageId = await handleImageUpload(promotionImage);
      } catch (error) {
        message.error('Failed to upload image.');
        return;
      }
    } else if (promotionImage) {
      const selectedPromotion = promotions.find(promo => promo.documentId === editingPromotionDocId);
      if (selectedPromotion && selectedPromotion.PromotePromo) {
        imageId = selectedPromotion.PromotePromo.id;
      }
    }

    const updatedPromotion = {
      PromitionName: promotionTitle,
      Discription: promotionDescription,
      CodeName: promotionCodeName,
      Discount: promotionDiscount,
      categories: promotionCategories.map((catId) => ({ id: catId })),
      PromotePromo: imageId ? { id: imageId } : null, 
    };

    try {
      const response = await axios.put(
        `http://localhost:1337/api/promotions/${editingPromotionDocId}`,
        { data: updatedPromotion },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      message.success('Promotion updated successfully!');
      setIsModalVisible(false);
      setIsEditing(false);
      setEditingPromotionDocId(null);
      setPromotionTitle('');
      setPromotionDescription('');
      setPromotionImage(null);
      setPromotionCategories([]);
      setPromotionCodeName('');
      setPromotionDiscount('');


      const promotionsResponse = await axios.get('http://localhost:1337/api/promotions?populate=*');
      setPromotions(promotionsResponse.data.data);
    } catch (error) {
      console.error('Error updating promotion:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
      }
      message.error('Failed to update promotion. Please check the API and permissions.');
    }
  };

  const handleCancel = () => {
    console.log('Cancel editing');
    setIsModalVisible(false);
    setIsEditing(false);
    setEditingPromotionDocId(null);
    setPromotionTitle('');
    setPromotionDescription('');
    setPromotionImage(null);
    setPromotionCategories([]);
  };

  const handleDelete = async (documentId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this promotion?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:1337/api/promotions/${documentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        message.success('Promotion deleted successfully!');
        setPromotions(promotions.filter(promo => promo.documentId !== documentId));
      } catch (error) {
        console.error('Error deleting promotion:', error);
        if (error.response) {
          console.error('Server response:', error.response.data);
        }
        message.error('Failed to delete promotion. Please check the API and permissions.');
      }
    }
  };

  return (
    <div className="edit-promotion-container">
      <h1>Edit Promotion</h1>
      <div className="edit-promotion-table">
        <div className="edit-promotion-table-header">
          <div className="edit-promotion-table-row">
            <div className="edit-promotion-table-cell">Title</div>
            <div className="edit-promotion-table-cell">Description</div>
            <div className="edit-promotion-table-cell">Image</div>
            <div className="edit-promotion-table-cell">Categories</div>
            <div className="edit-promotion-table-cell">Actions</div>
          </div>
        </div>
        <div className="edit-promotion-table-body">
          {promotions.map(promo => (
            <div key={promo.documentId} className="edit-promotion-table-row">
              <div className="edit-promotion-table-cell">
                {promo.PromitionName}
              </div>
              <div className="edit-promotion-table-cell">
                {promo.Discription}
              </div>
              <div className="edit-promotion-table-cell">
                {promo.PromotePromo?.url && (
                  <img
                    src={`http://localhost:1337${promo.PromotePromo.url}`}
                    alt="Promotion"
                    className="promotion-image"
                    width="100"
                    height="100"
                  />
                )}
              </div>
              <div className="edit-promotion-table-cell">
                {promo.categories.map((cat, index) => (
                  <div key={index}>{cat.Category}</div>
                ))}
              </div>
              <div className="edit-promotion-table-cell">
                <button className="edit-promotion-button" onClick={() => handleEdit(promo.documentId)}>Edit</button>
                <button className="edit-promotion-button delete" onClick={() => handleDelete(promo.documentId)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        title="Edit Promotion"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>Cancel</Button>,
          <Button key="save" type="primary" onClick={handleSave}>Save</Button>,
        ]}
      >
        <div className="edit-promotion-modal">
          <div className="modal-field">
            <label>Title</label>
            <Input
              value={promotionTitle}
              onChange={(e) => setPromotionTitle(e.target.value)}
            />
          </div>

          <div className="modal-field">
            <label>Description</label>
            <Input.TextArea
              value={promotionDescription}
              onChange={(e) => setPromotionDescription(e.target.value)}
            />
          </div>

          <div className="modal-field">
            <label>CodeName</label>
            <Input
              value={promotionCodeName}
              onChange={(e) => setPromotionCodeName(e.target.value)}
            />
          </div>

          <div className="modal-field">
            <label>Discount</label>
            <Input
              value={promotionDiscount}
              onChange={(e) => setPromotionDiscount(e.target.value)}
            />
          </div>

          <div className="modal-field">
            <label>Image</label>
            {promotionImage && (
              <div>
                <p>Current Image:</p>
                <img
                  src={promotionImage instanceof File ? URL.createObjectURL(promotionImage) : `http://localhost:1337${promotionImage}`} alt="Current Promotion"
                  style={{ width: '100px', height: '100px' }}
                />
              </div>
            )}
            <input
              type="file"
              onChange={(e) => setPromotionImage(e.target.files[0])}
            />
          </div>

          <div className="modal-field">
            <label>Categories</label>
            <Select
              mode="multiple"
              value={promotionCategories}
              onChange={(value) => setPromotionCategories(value)}
              options={categoriesOptions}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </Modal >
    </div >
  );
}

export default EditPromotion;
