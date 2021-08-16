import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { number } from 'prop-types';
import styled from 'styled-components';

const DotStyled = styled.div`
  background: var(--red);
  color: white;
  transform: rotate(5deg);
  padding: 0.5rem;
  line-height: 2rem;
  min-width: 3rem;
  margin-left: 1rem;
  font-feature-settings: 'tnum';
  font-variant: tabular-nums;
`;

const AnimationStyled = styled.span`
  position: relative;
  .count {
    display: block;
    position: relative;
    transition: transform 400ms ease;
    backface-visibility: hidden;
  }
  .count-enter {
    transform: scale(4) rotateX(0.5turn);
  }
  .count-enter-active {
    transform: rotateX(0);
  }
  .count-exit {
    position: absolute;
    top: 0;
    transform: rotateX(0);
  }
  .count-exit-active {
    transform: scale(4) rotateX(0.5turn);
  }
`;

const CartCount = ({ count }) => (
  <AnimationStyled>
    <TransitionGroup>
      <CSSTransition
        unmountOnExit
        className="count"
        classNames="count"
        key={count}
        timeout={{ enter: 400, exit: 400 }}
      >
        <DotStyled>{count}</DotStyled>
      </CSSTransition>
    </TransitionGroup>
  </AnimationStyled>
);

CartCount.propTypes = {
  count: number,
};

export default CartCount;
