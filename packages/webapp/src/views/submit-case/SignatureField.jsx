import { Button } from '@/components/ui';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next'


const SignatureField = ({ onSignatureSave }) => {
    const { t } = useTranslation()

  const canvasRef = useRef(null);
  let context = null;
  let isMouseDown = false;

  const handleMouseDown = (event) => {
    isMouseDown = true;
    const canvas = canvasRef.current;
    context = canvas.getContext('2d');
    context.beginPath();
    context.moveTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
  };

  const handleMouseMove = (event) => {
    if (isMouseDown) {
      const canvas = canvasRef.current;
      context = canvas.getContext('2d');
      context.lineTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
      context.stroke();
    }
  };

  const handleMouseUp = () => {
    isMouseDown = false;
  };

  const clearSignature = (event) => {
    event.preventDefault();
    const canvas = canvasRef.current;
    context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignature = (event) => {
    event.preventDefault();
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL();
    onSignatureSave(dataURL); 
  };

  return (
    <div>
<h6>{t('heading.Participant Signature')}</h6>
<br/>
      <canvas
        ref={canvasRef}
        width={200}
        height={100}
        style={{ border: '1px solid #000' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      <Button
            type="button"
            size="sm"
            className="w-50 mr-2 mt-2"
            onClick={clearSignature}
          >
            {t('button.Clear Sign')}
          </Button>
          <Button
            type="button"
            variant="solid"
            size="sm"
            className="w-50 mr-2 mt-2"
            onClick={saveSignature}
          >
            {t('button.Save Sign')}
          </Button>
      
    </div>
  );
};

export default SignatureField;
