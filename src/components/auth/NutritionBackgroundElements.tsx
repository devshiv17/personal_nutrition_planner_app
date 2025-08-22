import React from 'react';
import styled, { keyframes } from 'styled-components';

const float1 = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-20px) rotate(10deg); }
  66% { transform: translateY(10px) rotate(-5deg); }
`;

const float2 = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(15px) rotate(-8deg); }
  50% { transform: translateY(-10px) rotate(12deg); }
  75% { transform: translateY(5px) rotate(-3deg); }
`;

const float3 = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  40% { transform: translateY(-15px) rotate(6deg); }
  80% { transform: translateY(8px) rotate(-10deg); }
`;

const fadeInOut = keyframes`
  0%, 100% { opacity: 0.1; }
  50% { opacity: 0.3; }
`;

const BackgroundContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
`;

const FloatingElement = styled.div<{ 
  top: string; 
  left: string; 
  animationDelay: string; 
  animationType: 'float1' | 'float2' | 'float3';
  size: string;
}>`
  position: absolute;
  top: ${props => props.top};
  left: ${props => props.left};
  width: ${props => props.size};
  height: ${props => props.size};
  animation: ${props => {
    switch (props.animationType) {
      case 'float1': return float1;
      case 'float2': return float2;
      case 'float3': return float3;
      default: return float1;
    }
  }} 8s ease-in-out infinite;
  animation-delay: ${props => props.animationDelay};
  opacity: 0.15;
`;

const FruitIcon = styled.svg`
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
`;

const PulsingCircle = styled.div<{
  top: string;
  left: string;
  size: string;
  color: string;
  delay: string;
}>`
  position: absolute;
  top: ${props => props.top};
  left: ${props => props.left};
  width: ${props => props.size};
  height: ${props => props.size};
  border-radius: 50%;
  background: ${props => props.color};
  animation: ${fadeInOut} 6s ease-in-out infinite;
  animation-delay: ${props => props.delay};
`;

const NutritionBackgroundElements: React.FC = () => {
  return (
    <BackgroundContainer>
      {/* Floating Fruits and Vegetables */}
      <FloatingElement
        top="10%"
        left="15%"
        size="60px"
        animationDelay="0s"
        animationType="float1"
      >
        <FruitIcon viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Apple */}
          <path d="M30 50c-8.284 0-15-6.716-15-15s6.716-15 15-15 15 6.716 15 15-6.716 15-15 15z" fill="#ff6b6b"/>
          <path d="M35 20c0-2.761-2.239-5-5-5s-5 2.239-5 5" stroke="#4ecdc4" strokeWidth="2"/>
          <path d="M30 15v-5" stroke="#4ecdc4" strokeWidth="2"/>
        </FruitIcon>
      </FloatingElement>

      <FloatingElement
        top="20%"
        left="75%"
        size="45px"
        animationDelay="2s"
        animationType="float2"
      >
        <FruitIcon viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Carrot */}
          <path d="M22.5 35L15 5h15l-7.5 30z" fill="#ffa726"/>
          <path d="M15 5s5-3 7.5-3 7.5 3 7.5 3" stroke="#4caf50" strokeWidth="2"/>
        </FruitIcon>
      </FloatingElement>

      <FloatingElement
        top="60%"
        left="10%"
        size="55px"
        animationDelay="4s"
        animationType="float3"
      >
        <FruitIcon viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Broccoli */}
          <circle cx="27.5" cy="20" r="8" fill="#4caf50"/>
          <circle cx="20" cy="25" r="6" fill="#4caf50"/>
          <circle cx="35" cy="25" r="6" fill="#4caf50"/>
          <rect x="24" y="30" width="7" height="15" fill="#8bc34a"/>
        </FruitIcon>
      </FloatingElement>

      <FloatingElement
        top="70%"
        left="80%"
        size="50px"
        animationDelay="1s"
        animationType="float1"
      >
        <FruitIcon viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Banana */}
          <path d="M10 25c0-8.284 6.716-15 15-15s15 6.716 15 15c0 5-2 8-5 10s-8 2-15 2c-7 0-10-4-10-12z" fill="#ffeb3b"/>
        </FruitIcon>
      </FloatingElement>

      <FloatingElement
        top="40%"
        left="85%"
        size="40px"
        animationDelay="3s"
        animationType="float2"
      >
        <FruitIcon viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Tomato */}
          <circle cx="20" cy="22" r="12" fill="#f44336"/>
          <path d="M15 10s2-3 5-3 5 3 5 3" stroke="#4caf50" strokeWidth="2"/>
        </FruitIcon>
      </FloatingElement>

      {/* Pulsing Circles for Additional Visual Interest */}
      <PulsingCircle
        top="15%"
        left="50%"
        size="20px"
        color="rgba(102, 126, 234, 0.2)"
        delay="0s"
      />
      
      <PulsingCircle
        top="80%"
        left="30%"
        size="15px"
        color="rgba(240, 147, 251, 0.2)"
        delay="2s"
      />
      
      <PulsingCircle
        top="25%"
        left="5%"
        size="25px"
        color="rgba(245, 87, 108, 0.15)"
        delay="4s"
      />
      
      <PulsingCircle
        top="55%"
        left="60%"
        size="18px"
        color="rgba(79, 172, 254, 0.2)"
        delay="1s"
      />
    </BackgroundContainer>
  );
};

export default NutritionBackgroundElements;