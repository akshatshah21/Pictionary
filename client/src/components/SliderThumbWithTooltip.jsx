import {
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderTrack,
  Tooltip,
  SliderThumb,
} from "@chakra-ui/react";
import { useState } from "react";

export function SliderThumbWithTooltip({
  initialValue,
  max,
  min,
  step,
  sliderMarks,
  onChangeEnd,
  isDisabled,
}) {
  const [sliderValue, setSliderValue] = useState(initialValue);
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <Slider
      isDisabled={isDisabled}
      defaultValue={initialValue}
      min={min}
      max={max}
      step={step ? step : 1}
      onChange={(v) => setSliderValue(v)}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onChangeEnd={onChangeEnd}
    >
      {sliderMarks &&
        sliderMarks.map((sliderMark) => (
          <SliderMark
            key={sliderMark}
            value={sliderMark}
            mt="1"
            ml="-2.5"
            fontSize="sm"
          >
            {sliderMark}
          </SliderMark>
        ))}
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <Tooltip
        hasArrow
        placement="top"
        isOpen={showTooltip}
        label={sliderValue}
      >
        <SliderThumb />
      </Tooltip>
    </Slider>
  );
}
