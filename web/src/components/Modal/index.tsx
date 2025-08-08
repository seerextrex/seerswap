import React from "react";
import { useSpring, useTransition } from "react-spring";
import { isMobile } from "react-device-detect";
import { useGesture } from "react-use-gesture";
import { StyledDialogContent, StyledDialogOverlay } from "./styled";

interface ModalProps {
    isOpen: boolean;
    onDismiss: () => void;
    minHeight?: number | false;
    maxHeight?: number;
    initialFocusRef?: React.RefObject<any>;
    dangerouslyBypassFocusLock?: boolean;
    children?: React.ReactNode;
    onHide?: () => void;
    fitContent?: boolean;
}

export default function Modal({ isOpen, onDismiss, minHeight = false, maxHeight = 90, initialFocusRef, dangerouslyBypassFocusLock, children, fitContent, onHide }: ModalProps) {
    const [hasAnimated, setHasAnimated] = React.useState(false);
    
    React.useEffect(() => {
        if (isOpen && !hasAnimated) {
            setHasAnimated(true);
        }
    }, [isOpen, hasAnimated]);
    
    const fadeTransition = useTransition(isOpen, null, {
        config: { duration: 100, tension: 350, friction: 25 },
        from: { opacity: hasAnimated ? 0 : 1 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        immediate: !hasAnimated,
        unique: true,
    });

    const [{ y }, set] = useSpring(() => ({
        y: 0,
        config: { mass: 1, tension: 210, friction: 20 },
    }));
    const bind = useGesture({
        onDrag: (state) => {
            set({
                y: state.down ? state.movement[1] : 0,
            });
            if (state.movement[1] > 300 || (state.velocity > 3 && state.direction[1] > 0)) {
                onDismiss();
            }
        },
    });

    return (
        <>
            {fadeTransition.map(
                ({ item, key, props }) =>
                    item && (
                        <StyledDialogOverlay
                            key={key}
                            style={props}
                            onDismiss={onDismiss}
                            initialFocusRef={initialFocusRef}
                            dangerouslyBypassFocusLock={dangerouslyBypassFocusLock}
                            onClick={onHide}
                        >
                            <StyledDialogContent
                                {...(isMobile
                                    ? {
                                        ...bind(),
                                        style: { transform: `translateY(-3rem)` },
                                    }
                                    : {
                                        style: { width: fitContent ? "unset" : "400px" },
                                    })}
                                aria-label="dialog content"
                                minHeight={minHeight}
                                maxHeight={maxHeight}
                                mobile={isMobile}
                            >
                                {/* prevents the automatic focusing of inputs on mobile by the reach dialog */}
                                {!initialFocusRef && isMobile ? <div tabIndex={1} /> : null}
                                {children}
                            </StyledDialogContent>
                        </StyledDialogOverlay>
                    )
            )}
        </>
    );
}
