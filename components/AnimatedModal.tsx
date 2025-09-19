import React, { ReactNode, useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Easing,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface AnimatedModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  animationType?: "scale" | "fade" | "slide";
  backdropOpacity?: number;
  animationDuration?: number | string; // Accept both number and string but convert to number
}

const AnimatedModal: React.FC<AnimatedModalProps> = ({
  visible,
  onClose,
  children,
  animationType = "scale",
  backdropOpacity = 0.5,
  animationDuration = 400,
}) => {
  // Convert animationDuration to number and memoize
  const duration = useMemo(
    () => Number(animationDuration),
    [animationDuration]
  );

  // Memoize animation values
  const scaleValue = useRef(new Animated.Value(0)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;

  // Memoize animation config to prevent recreation
  const animationConfig = useMemo(
    () => ({
      scale: {
        inputRange: [0, 1],
        outputRange: [0.7, 1],
      },
      fade: {
        duration,
        easing: Easing.out(Easing.cubic),
      },
    }),
    [duration]
  );

  useEffect(() => {
    if (visible) {
      scaleValue.setValue(
        animationType === "scale" ? animationConfig.scale.inputRange[0] : 1
      );
      fadeValue.setValue(0);

      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 1,
          damping: 15,
          useNativeDriver: true,
        }),
        Animated.timing(fadeValue, {
          toValue: 1,
          duration: animationConfig.fade.duration,
          easing: animationConfig.fade.easing,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleValue, {
          toValue:
            animationType === "scale" ? animationConfig.scale.inputRange[0] : 1,
          duration: animationConfig.fade.duration,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(fadeValue, {
          toValue: 0,
          duration: animationConfig.fade.duration,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, animationType, animationConfig, scaleValue, fadeValue]);

  const getAnimationStyle = () => {
    const baseStyle = { opacity: fadeValue };

    switch (animationType) {
      case "scale":
        return {
          ...baseStyle,
          transform: [{ scale: scaleValue }],
        };
      case "slide":
        return {
          ...baseStyle,
          transform: [
            {
              translateY: fadeValue.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        };
      default:
        return baseStyle;
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: fadeValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, backdropOpacity],
              }),
            },
          ]}
        />
      </TouchableWithoutFeedback>

      <View style={styles.modalContainer}>
        <Animated.View style={[styles.modalContent, getAnimationStyle()]}>
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "box-none",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default React.memo(AnimatedModal);
