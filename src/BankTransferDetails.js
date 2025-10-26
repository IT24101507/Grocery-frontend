import React, { useState } from 'react';

const BankTransferDetails = ({ onFileChange }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragOver, setIsDragOver] = useState(false);

    const handleFileSelect = (file) => {
        if (!file) return;
        
        // Basic validation
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            alert('Please select a valid file type (JPG, PNG, or PDF)');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }
        
        setSelectedFile(file);
        onFileChange(file);
    };

    const handleFileRemove = () => {
        setSelectedFile(null);
        onFileChange(null);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    return (
        <div className="form-section">
            <h2 className="section-title">Bank Transfer Details</h2>
            <div className="bank-details">
                <div className="bank-info">
                    <div>
                        <div className="bank-detail-item">
                            <span className="bank-label">Bank Name:</span>
                            <span className="bank-value">Commercial Bank of Ceylon</span>
                        </div>
                        <div className="bank-detail-item">
                            <span className="bank-label">Account Name:</span>
                            <span className="bank-value">Ravindra Stores</span>
                        </div>
                        <div className="bank-detail-item">
                            <span className="bank-label">Account Number:</span>
                            <span className="bank-value">1234567890123</span>
                        </div>
                        <div className="bank-detail-item">
                            <span className="bank-label">Branch:</span>
                            <span className="bank-value">Colombo Main Branch</span>
                        </div>
                    </div>
                </div>
                
                <div className="upload-section">
                    <h3 style={{marginBottom: '1rem', color: '#495057'}}>Upload Transfer Slip</h3>
                    <input
                        type="file"
                        id="transfer-slip"
                        className="file-input"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) => handleFileSelect(e.target.files[0])}
                    />
                    <div
                        className={`upload-area ${isDragOver ? 'dragover' : ''}`}
                        onClick={() => document.getElementById('transfer-slip').click()}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <div className="upload-icon">@</div>
                        <div className="upload-text">Click to upload your transfer slip or drag and drop</div>
                        <div className="file-types">Accepted formats: JPG, PNG, PDF (Max 5MB)</div>
                    </div>
                    {selectedFile && (
                        <div className="selected-file" style={{display: 'flex'}}>
                            <span className="file-name">{selectedFile.name}</span>
                            <button type="button" className="remove-file" onClick={handleFileRemove}>×</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BankTransferDetails;
