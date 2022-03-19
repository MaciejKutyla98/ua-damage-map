import { useWindowSize } from 'react-use';

export const useIsMobile = () => {
  const {width, height} = useWindowSize();

  return width < 900;
};
