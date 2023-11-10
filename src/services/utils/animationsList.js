import { useAutoAnimate } from '@formkit/auto-animate/react';

export const useListAnimation = () => {
  const [parent, enableAnimations] = useAutoAnimate({
    duration: 300,
    easing: 'ease-in-out',
    stagger: 100,
    delay: 0,
    direction: 'normal',
    fill: 'both',
    animate: {
      opacity: [0, 1],
      transform: ['translateY(100px)', 'translateY(0px)'],
    },
    exit: {
      opacity: [1, 0],
      transform: ['translateY(0px)', 'translateY(100px)'],
    },
  });

  return [parent, enableAnimations];
};
