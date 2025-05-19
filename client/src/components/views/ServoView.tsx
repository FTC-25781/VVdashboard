import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import BaseView, {
  BaseViewHeading,
  BaseViewBody,
  BaseViewProps,
  BaseViewHeadingProps,
} from './BaseView';
import { RootState } from '@/store/reducers';

import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

type ServoViewProps = BaseViewProps & BaseViewHeadingProps;

const ServoView = ({
  isDraggable = false,
  isUnlocked = false,
}: ServoViewProps)  => {
       const [log, setLog] = useState<string[]>([]);
       const [data, setData] = useState<{ [key: string]: string }>({});

       const packets = useSelector((state: RootState) => state.telemetry);
       useEffect(() => {
         if (packets.length === 0) {
           setLog([]);
           setData({});
           return;
         }

         setLog(
           packets.reduce(
             (acc, { log: newLog }) => (newLog.length === 0 ? acc : newLog),
             log,
           ),
         );

         setData(
           packets.reduce(
             (acc, { data: newData }) =>
               Object.keys(newData).reduce(
                 (acc, k) => ({ ...acc, [k]: newData[k] }),
                 acc,
               ),
             data,
           ),
         );
       }, [packets]);

       const telemetryLines = Object.keys(data).map((key) => (
         <span
           key={key}
           dangerouslySetInnerHTML={{ __html: `${key}: ${data[key]}<br />` }}
         />
       ));

       const telemetryLog = log.map((line, i) => (
         <span key={i} dangerouslySetInnerHTML={{ __html: `${line}<br />` }} />
       ));
     const [position, setPosition] = useState<number>(90); // Initial at center

       const handleChange = (value: number[]) => {
         setPosition(value[0]);
         // You can also send this value to your backend/microcontroller here
         // e.g., sendServoPosition(value[0]);
       };
       return (
          <Card className="max-w-md mx-auto mt-10 p-6 shadow-lg rounded-2xl">
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <Label htmlFor="servo-slider">Servo Position</Label>
                <span className="text-sm font-medium">{position}°</span>
              </div>
              <Slider
                id="servo-slider"
                min={0}
                max={180}
                step={1}
                defaultValue={[position]}
                onValueChange={handleChange}
              />
            </CardContent>
          </Card>
      );
};

export default ServoView;
