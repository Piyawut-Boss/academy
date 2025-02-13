// Step.js
import React from 'react';

function Step({ step }) {
    return (
        <div className="step">
            <div className="step-number">{step.id}</div>
            <div className="step-content">
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
            </div>
            <img src={step.img} alt={step.title} className="step-image" />
        </div>
    );
}

export default Step;