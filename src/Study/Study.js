import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Study.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import config from '../config';

const API_BASE = config.apiBaseUrl;

const Study = () => {
  const { documentId } = useParams();
  const [course, setCourse] = useState(null);
  const [units, setUnits] = useState([]);
  const [currentUnit, setCurrentUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [, setVideoTime] = useState('00:00');

  console.log('Document ID:', documentId);

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/courses?filters[documentId][$eq]=${documentId}&populate[units][populate][]=video&populate[units][populate][]=File`)
      .then(response => {
        console.log('Full Response:', response);
        console.log('Response Data:', response.data);
        const data = response.data.data?.[0];
        if (data) {
          setCourse(data);
          setUnits(data.units || []);
          setCurrentUnit(data.units?.[0] || null);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching course:', error);
        setError('ไม่สามารถโหลดข้อมูลคอร์สได้');
        setLoading(false);
      });
  }, [documentId]);

  useEffect(() => {
    if (currentUnit) {
      const savedTime = localStorage.getItem(`videoTime-${currentUnit.documentId}`);
      if (savedTime) {
        setVideoTime(savedTime);
      } else {
        setVideoTime('00:00');
      }
    }
  }, [currentUnit]);

  if (loading) return <div>กำลังโหลดข้อมูล...</div>;
  if (error) return <div>{error}</div>;

  const handleUnitChange = (direction) => {
    if (!currentUnit) return;
    const index = units.findIndex(u => u.documentId === currentUnit.documentId);
    const newIndex = direction === 'next' ? index + 1 : index - 1;
    if (newIndex >= 0 && newIndex < units.length) {
      setCurrentUnit(units[newIndex]);
    }
  };

  const handleDownloadPDF = async (fileUrl, fileName) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName || "document.pdf"; // ตั้งชื่อไฟล์ที่ดาวน์โหลด
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("ไม่สามารถดาวน์โหลดไฟล์ได้");
    }
  };

  const handleTimeUpdate = (event) => {
    const video = event.target;
    const minutes = Math.floor(video.currentTime / 60);
    const seconds = Math.floor(video.currentTime % 60);
    const currentTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    setVideoTime(currentTime);
    if (currentUnit) {
      localStorage.setItem(`videoTime-${currentUnit.documentId}`, currentTime);
    }
  };

  const handleVideoLoaded = (event) => {
    const video = event.target;
    if (currentUnit) {
      const savedTime = localStorage.getItem(`videoTime-${currentUnit.documentId}`);
      if (savedTime) {
        const [minutes, seconds] = savedTime.split(':').map(Number);
        video.currentTime = minutes * 60 + seconds;
      }
    }
  };

  return (
    <div className="study-container">
      <div className="study-nav-bar">
        <button
          className="study-nav-button"
          onClick={() => handleUnitChange('prev')}
          disabled={units[0]?.documentId === currentUnit?.documentId}
        >
          <ChevronLeft className="study-icon" />
          <span>Previous</span>
        </button>
        <span className="study-current-unit">{currentUnit?.unitname}</span>
        <button
          className="study-nav-button"
          onClick={() => handleUnitChange('next')}
          disabled={units[units.length - 1]?.documentId === currentUnit?.documentId}
        >
          <span>Next</span>
          <ChevronRight className="study-icon" />
        </button>
      </div>

      <div className="study-main-content">
        <div className="study-content-area">
          <div className="study-video-section">
            <div className="study-video-container">
              <div className="study-video-placeholder">
                {currentUnit?.video?.url ? (
                  <video
                    key={currentUnit.documentId}
                    controls
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleVideoLoaded}
                  >
                    <source src={`${API_BASE}${currentUnit.video.url}`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <span>No Video Available</span>
                )}
              </div>
            </div>
            <div className="study-content-description">
              <h2>{currentUnit?.unitname}</h2>
              <p>{currentUnit?.Discription}</p>

              <div className="study-pdf-link">
                {currentUnit?.File?.url ? (
                  <button
                    onClick={() =>
                      handleDownloadPDF(`${API_BASE}${currentUnit.File.url}`, currentUnit.File.name)
                    }
                    className="study-download-button"
                  >
                    ดาวน์โหลดเอกสาร PDF
                  </button>
                ) : (
                  <span>No PDF Available</span>
                )}
              </div>


            </div>
          </div>
        </div>

        <div className="study-sidebar">
          <div className="study-sidebar-content">
            <h3>{course?.Title}</h3>
            <ul className="study-unit-list">
              {units.map((unit) => {
                const unitTitle = unit.unitname.includes('.')
                  ? unit.unitname.split('.').slice(1).join(' ').trim()
                  : unit.unitname;
                return (
                  <li
                    key={unit.documentId}
                    className={unit.documentId === currentUnit?.documentId ? 'active' : ''}
                    onClick={() => setCurrentUnit(unit)}
                  >
                    <span className="study-unit-title">{unitTitle}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Study;
