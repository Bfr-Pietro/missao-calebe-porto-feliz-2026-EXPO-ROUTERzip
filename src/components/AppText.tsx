import React from "react";
import { Text, TextProps } from "react-native";
import { typography } from "../theme/typography";
import { useAppTheme } from "../context/ThemeContext";

type Variant = keyof typeof typography;

interface AppTextProps extends TextProps {
  variant?: Variant;
  color?: string;
  center?: boolean;
}

export const AppText: React.FC<AppTextProps> = ({
  variant = "body",
  color,
  center,
  style,
  children,
  ...rest
}) => {
  const { theme } = useAppTheme();

  return (
    <Text
      style={[
        typography[variant],
        { color: color ?? theme.textPrimary, textAlign: center ? "center" : undefined },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
};
