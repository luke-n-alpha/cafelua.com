'use client';

import Image from 'next/image';
import '@/components/UnderConstruction.css';
import '@/components/CoffeeChatDialog.css';

// Note: BackgroundMusic and other interactive elements are commented out for this initial layout.
// They can be added in a future step.

export default function TarotPage() {
  return (
    <div className="construction-overlay coffee-chat-mode">
      {/* Background will be black from the overlay's CSS */}
      <div className="construction-bg" style={{ backgroundColor: 'black' }} />

      {/* Main Illustration: Alpha ready for tarot reading */}
      <div className="construction-illustration-frame">
        <Image
          src="/characters/alpha/alpha-tarot-ready.webp"
          alt="Alpha ready for a tarot reading"
          width={1376}
          height={768}
          className="construction-illustration"
          priority
        />
      </div>

      {/* VN Style Dialogue Container */}
      <div className="vn-container">
        <div className="vn-dialogue-box">
          <div className="vn-content-row">
            {/* Text Group for Alpha's dialogue */}
            <div className="vn-text-group" style={{ marginLeft: '20px', width: '100%' }}>
              <div className="vn-name">Alpha</div>
              <p className="vn-text">
                마음의 준비가 되면, 당신의 카드를 선택해주세요.
              </p>
            </div>
          </div>

          {/* Placeholder for future card selection UI */}
          <div className="cc-actions-row">
            <p style={{ color: '#888', width: '100%', textAlign: 'center', fontStyle: 'italic' }}>
              [ 카드 선택 영역이 여기에 표시됩니다 ]
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
