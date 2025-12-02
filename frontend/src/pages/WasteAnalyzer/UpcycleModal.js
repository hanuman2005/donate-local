import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const UpcycleModal = ({ isOpen, onClose, ideas }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <Overlay
        as={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <Modal
          as={motion.div}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Header>
            <Title>💡 Creative Upcycling Ideas</Title>
            <CloseButton onClick={onClose}>✕</CloseButton>
          </Header>

          <Content>
            {ideas.map((idea, index) => (
              <IdeaCard key={index}>
                <IdeaHeader>
                  <IdeaTitle>{idea.title}</IdeaTitle>
                  <DifficultyBadge $difficulty={idea.difficulty}>
                    {idea.difficulty}
                  </DifficultyBadge>
                </IdeaHeader>

                <Description>{idea.description}</Description>

                <Details>
                  <DetailItem>
                    <Icon>⏱️</Icon> {idea.timeMin} minutes
                  </DetailItem>
                  <DetailItem>
                    <Icon>🔧</Icon> {idea.materials.join(', ')}
                  </DetailItem>
                </Details>

                <Steps>
                  <StepsTitle>Steps:</StepsTitle>
                  {idea.steps.map((step, i) => (
                    <Step key={i}>
                      {i + 1}. {step}
                    </Step>
                  ))}
                </Steps>
              </IdeaCard>
            ))}
          </Content>
        </Modal>
      </Overlay>
    </AnimatePresence>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 2rem;
`;

const Modal = styled.div`
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: var(--shadow-xl);
`;

const Header = styled.div`
  background: var(--gradient-primary);
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0;
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.5rem;
  transition: all 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const Content = styled.div`
  padding: 2rem;
  overflow-y: auto;
  max-height: calc(90vh - 100px);
`;

const IdeaCard = styled.div`
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 2px solid var(--border-color);

  &:last-child {
    margin-bottom: 0;
  }
`;

const IdeaHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const IdeaTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
`;

const DifficultyBadge = styled.span`
  padding: 0.5rem 1rem;
  border-radius: var(--radius-full);
  font-size: 0.85rem;
  font-weight: 600;
  background: ${props => {
    if (props.$difficulty === 'easy') return 'var(--success)';
    if (props.$difficulty === 'medium') return 'var(--warning)';
    return 'var(--error)';
  }};
  color: white;
`;

const Description = styled.p`
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const Details = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.95rem;
`;

const Icon = styled.span`
  font-size: 1.1rem;
`;

const Steps = styled.div`
  margin-top: 1rem;
`;

const StepsTitle = styled.h4`
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--text-primary);
`;

const Step = styled.div`
  padding: 0.5rem 0;
  color: var(--text-secondary);
  line-height: 1.5;
`;

export default UpcycleModal;