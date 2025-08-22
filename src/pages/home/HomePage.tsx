import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ROUTES } from '../../constants';

// Animation keyframes
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const fadeInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
`;

const gradientShift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;


// Styled components
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #f5576c, #4facfe, #00f2fe);
  background-size: 400% 400%;
  animation: ${gradientShift} 15s ease infinite;
  overflow-x: hidden;
`;

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;

  &.scrolled {
    padding: 0.5rem 0;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  }
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const Logo = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${fadeInLeft} 1s ease-out;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
  animation: ${fadeInRight} 1s ease-out;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: #333;
  text-decoration: none;
  font-weight: 600;
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    color: #667eea;
    transform: translateY(-2px);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(45deg, #667eea, #764ba2);
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }
`;

const Hero = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 2rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 20%;
    left: 10%;
    width: 200px;
    height: 200px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    animation: ${float} 6s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 20%;
    right: 10%;
    width: 150px;
    height: 150px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    animation: ${float} 8s ease-in-out infinite reverse;
  }
`;

const HeroContent = styled.div`
  max-width: 800px;
  z-index: 2;
  position: relative;
`;

const HeroTitle = styled.h1`
  font-size: 4rem;
  font-weight: 900;
  color: white;
  margin-bottom: 1.5rem;
  line-height: 1.1;
  animation: ${fadeInUp} 1s ease-out;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }

  span {
    background: linear-gradient(45deg, #ff6b6b, #feca57);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 3rem;
  line-height: 1.6;
  animation: ${fadeInUp} 1s ease-out 0.2s both;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  animation: ${fadeInUp} 1s ease-out 0.4s both;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const AnimatedButton = styled(Button)`
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  border-radius: 50px;
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 700;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
`;

const CTAAnimatedButton = styled(AnimatedButton)`
  background: white;
  color: #667eea;
  border: none;

  &:hover {
    background: #f8f9ff;
    color: #5a67d8;
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
`;

const Stats = styled.section`
  padding: 6rem 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
`;

const StatsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 3rem;
  text-align: center;
`;

const StatItem = styled.div`
  animation: ${fadeInUp} 1s ease-out;

  &:nth-child(2) {
    animation-delay: 0.1s;
  }
  &:nth-child(3) {
    animation-delay: 0.2s;
  }
  &:nth-child(4) {
    animation-delay: 0.3s;
  }
`;

const StatNumber = styled.div`
  font-size: 3rem;
  font-weight: 900;
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1.1rem;
  color: #666;
  font-weight: 600;
`;

const Features = styled.section`
  padding: 6rem 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 3rem;
  font-weight: 800;
  color: #333;
  margin-bottom: 1rem;
  animation: ${fadeInUp} 1s ease-out;
`;

const SectionSubtitle = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 4rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  animation: ${fadeInUp} 1s ease-out 0.2s both;
`;

const FeatureGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
`;

const FeatureCard = styled(Card)`
  text-align: center;
  padding: 3rem 2rem;
  border-radius: 20px;
  background: white;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
  animation: ${fadeInUp} 1s ease-out;

  &:nth-child(2) { animation-delay: 0.1s; }
  &:nth-child(3) { animation-delay: 0.2s; }
  &:nth-child(4) { animation-delay: 0.3s; }
  &:nth-child(5) { animation-delay: 0.4s; }
  &:nth-child(6) { animation-delay: 0.5s; }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(45deg, #667eea, #764ba2);
    transform: scaleX(0);
    transition: transform 0.3s ease;
    transform-origin: left;
  }

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  }

  &:hover::before {
    transform: scaleX(1);
  }
`;

const FeatureIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1.5rem;
  animation: ${pulse} 2s infinite;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  color: #666;
  line-height: 1.6;
  font-size: 1rem;
`;

const Testimonials = styled.section`
  padding: 6rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
`;

const TestimonialContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  text-align: center;
`;

const TestimonialCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 3rem;
  margin: 2rem 0;
  animation: ${fadeInUp} 1s ease-out;
`;

const TestimonialText = styled.p`
  font-size: 1.3rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  font-style: italic;
`;

const TestimonialAuthor = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
`;

const CTA = styled.section`
  padding: 6rem 2rem;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%);
  text-align: center;
  color: white;
`;

const CTATitle = styled.h2`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  animation: ${fadeInUp} 1s ease-out;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const CTASubtitle = styled.p`
  font-size: 1.3rem;
  margin-bottom: 3rem;
  animation: ${fadeInUp} 1s ease-out 0.2s both;
  opacity: 0.9;
`;

const Footer = styled.footer`
  background: #1a1a1a;
  color: white;
  padding: 4rem 2rem 2rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  margin-bottom: 2rem;
`;

const FooterSection = styled.div`
  h3 {
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: #ff6b6b;
  }

  p, a {
    color: #ccc;
    line-height: 1.6;
    text-decoration: none;
    transition: color 0.3s ease;
  }

  a:hover {
    color: #ff6b6b;
  }
`;

const FooterBottom = styled.div`
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid #333;
  color: #999;
`;

// Counter hook for animated numbers
const useCounter = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end, duration]);

  return count;
};

const AnimatedCounter: React.FC<{ end: number; suffix?: string }> = ({ end, suffix = '' }) => {
  const count = useCounter(end);
  return <>{count.toLocaleString()}{suffix}</>;
};

const HomePage: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Container>
      <Header className={scrolled ? 'scrolled' : ''}>
        <Nav>
          <Logo>🥗 NutriPlan</Logo>
          <NavLinks>
            <NavLink to={ROUTES.ABOUT}>About</NavLink>
            <NavLink to={ROUTES.FEATURES}>Features</NavLink>
            <NavLink to={ROUTES.HELP}>Help</NavLink>
            <Link to={ROUTES.LOGIN}>
              <AnimatedButton variant="outline" size="sm">
                Sign In
              </AnimatedButton>
            </Link>
          </NavLinks>
        </Nav>
      </Header>

      <Hero>
        <HeroContent>
          <HeroTitle>
            Transform Your <span>Health</span> with AI-Powered Nutrition
          </HeroTitle>
          <HeroSubtitle>
            Personalized meal plans, voice logging, and smart tracking 
            to help you achieve your health goals faster than ever.
          </HeroSubtitle>
          
          <CTAButtons>
            <Link to={ROUTES.REGISTER}>
              <AnimatedButton size="lg">
                🚀 Start Your Journey
              </AnimatedButton>
            </Link>
            <Link to={ROUTES.LOGIN}>
              <AnimatedButton variant="outline" size="lg">
                ▶️ Watch Demo
              </AnimatedButton>
            </Link>
          </CTAButtons>
        </HeroContent>
      </Hero>

      <Stats>
        <StatsContainer>
          <StatItem>
            <StatNumber><AnimatedCounter end={10000} suffix="+" /></StatNumber>
            <StatLabel>Happy Users</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber><AnimatedCounter end={50000} suffix="+" /></StatNumber>
            <StatLabel>Meals Planned</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber><AnimatedCounter end={95} suffix="%" /></StatNumber>
            <StatLabel>Success Rate</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber><AnimatedCounter end={24} suffix="/7" /></StatNumber>
            <StatLabel>AI Support</StatLabel>
          </StatItem>
        </StatsContainer>
      </Stats>

      <Features>
        <SectionTitle>Powerful Features</SectionTitle>
        <SectionSubtitle>
          Everything you need to transform your nutrition and achieve your health goals
        </SectionSubtitle>
        
        <FeatureGrid>
          <FeatureCard>
            <FeatureIcon>🤖</FeatureIcon>
            <FeatureTitle>AI Meal Planning</FeatureTitle>
            <FeatureDescription>
              Get personalized weekly meal plans generated by AI based on your dietary preferences, health goals, and nutritional needs.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>🎤</FeatureIcon>
            <FeatureTitle>Voice Food Logging</FeatureTitle>
            <FeatureDescription>
              Simply speak what you ate and our AI will automatically log nutrition data. No more tedious manual entry!
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>📊</FeatureIcon>
            <FeatureTitle>Smart Analytics</FeatureTitle>
            <FeatureDescription>
              Track your progress with beautiful charts, insights, and personalized recommendations to stay on track.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>🛒</FeatureIcon>
            <FeatureTitle>Auto Grocery Lists</FeatureTitle>
            <FeatureDescription>
              Automatically generated shopping lists from your meal plans, organized by store sections for efficient shopping.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>🥗</FeatureIcon>
            <FeatureTitle>Multiple Diets</FeatureTitle>
            <FeatureDescription>
              Support for Keto, Mediterranean, Vegan, Diabetic-friendly, and custom diets with balanced nutrition.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>📱</FeatureIcon>
            <FeatureTitle>Mobile First</FeatureTitle>
            <FeatureDescription>
              Beautiful, responsive design that works perfectly on all devices. Access your nutrition plan anywhere.
            </FeatureDescription>
          </FeatureCard>
        </FeatureGrid>
      </Features>

      <Testimonials>
        <TestimonialContainer>
          <SectionTitle style={{color: 'white'}}>What Our Users Say</SectionTitle>
          
          <TestimonialCard>
            <TestimonialText>
              "NutriPlan has completely transformed my relationship with food. 
              The AI meal planning is incredibly accurate and the voice logging 
              makes tracking so easy. I've lost 20 pounds in 3 months!"
            </TestimonialText>
            <TestimonialAuthor>— Sarah Johnson, Marketing Manager</TestimonialAuthor>
          </TestimonialCard>
        </TestimonialContainer>
      </Testimonials>

      <CTA>
        <CTATitle>Ready to Transform Your Health?</CTATitle>
        <CTASubtitle>
          Join thousands of users who have already achieved their health goals with NutriPlan
        </CTASubtitle>
        <Link to={ROUTES.REGISTER}>
          <CTAAnimatedButton size="lg">
            🎯 Get Started Free Today
          </CTAAnimatedButton>
        </Link>
      </CTA>

      <Footer>
        <FooterContent>
          <FooterSection>
            <h3>NutriPlan</h3>
            <p>
              Transforming lives through personalized nutrition and AI-powered meal planning.
            </p>
          </FooterSection>
          
          <FooterSection>
            <h3>Features</h3>
            <p><Link to={ROUTES.FEATURES}>AI Meal Planning</Link></p>
            <p><Link to={ROUTES.FEATURES}>Voice Logging</Link></p>
            <p><Link to={ROUTES.FEATURES}>Progress Tracking</Link></p>
            <p><Link to={ROUTES.FEATURES}>Smart Analytics</Link></p>
          </FooterSection>
          
          <FooterSection>
            <h3>Support</h3>
            <p><a href={ROUTES.HELP}>Help Center</a></p>
            <p><a href={ROUTES.CONTACT}>Contact Us</a></p>
            <p><Link to={ROUTES.HELP}>API Documentation</Link></p>
            <p><Link to={ROUTES.HELP}>Community</Link></p>
          </FooterSection>
          
          <FooterSection>
            <h3>Company</h3>
            <p><a href={ROUTES.ABOUT}>About Us</a></p>
            <p><a href={ROUTES.PRIVACY}>Privacy Policy</a></p>
            <p><a href={ROUTES.TERMS}>Terms of Service</a></p>
            <p><Link to={ROUTES.ABOUT}>Careers</Link></p>
          </FooterSection>
        </FooterContent>
        
        <FooterBottom>
          <p>&copy; 2024 NutriPlan. All rights reserved. Made with ❤️ for better health.</p>
        </FooterBottom>
      </Footer>
    </Container>
  );
};

export default HomePage;