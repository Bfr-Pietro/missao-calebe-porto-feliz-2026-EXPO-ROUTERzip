import React from "react";
import { View, ViewProps } from "react-native";
import { useAppTheme } from "../context/ThemeContext";
import { radius, shadow, spacing } from "../theme/spacing";

interface CardProps extends ViewProps {
  padded?: boolean;
  elevated?: boolean;
}

export const Card: React.FC<CardProps> = ({ padded = true, elevated = true, style, children, ...rest }) => {
  const { theme } = useAppTheme();

  return (
    <View
      style={[
        {
          backgroundColor: theme.surface,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: theme.border,
          padding: padded ? spacing.md : 0,
        },
        elevated && shadow.md,
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
};
