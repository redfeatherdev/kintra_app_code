import { useState } from 'react';
import { toast } from 'sonner';
import { Button, Input, Select, Modal } from 'rizzui';
import { MdDriveFolderUpload } from 'react-icons/md';

const AppNotificationModal = ({
  isOpen,
  onClose,
  appNotificationSettings,
  setAppNotificationSettings,
}: {
  isOpen: boolean;
  onClose: () => void;
  appNotificationSettings: any;
  setAppNotificationSettings: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const popupSettings = [
    'Initialization',
    'Home Page',
    'Statistics',
    'Chat Page',
    'Profile Page',
  ];
  const textPositions = [
    'Top Left',
    'Top Centered',
    'Top Middle',
    'Low Left',
    'Low Right',
    'Low Middle',
  ];

  const [previewImgURL, setPreviewImgURL] = useState<string>('');
  const [errors, setErrors] = useState({
    btnText: '',
    text: '',
  });

  const handleChange = (field: string, value: any) => {
    if (field.includes('Color')) {
      const [colorType, colorName] = field.split('.') as [
        'btnColor' | 'txtColor',
        'red' | 'green' | 'blue',
      ];
      setAppNotificationSettings((prev: any) => ({
        ...prev,
        [colorType]: {
          ...prev[colorType],
          [colorName]: value,
        },
      }));
    } else {
      setAppNotificationSettings((prev: any) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSelectChange = (setting: any) => {
    setAppNotificationSettings((prev: any) => ({
      ...prev,
      [setting.key]: setting.value,
    }));
  };

  const handleSaveSettings = () => {
    if (
      parseInt(appNotificationSettings.btnColor.red) < 0 ||
      parseInt(appNotificationSettings.btnColor.red) > 255 ||
      parseInt(appNotificationSettings.btnColor.green) < 0 ||
      parseInt(appNotificationSettings.btnColor.green) > 255 ||
      parseInt(appNotificationSettings.btnColor.blue) < 0 ||
      parseInt(appNotificationSettings.btnColor.blue) > 255 ||
      parseInt(appNotificationSettings.txtColor.red) < 0 ||
      parseInt(appNotificationSettings.txtColor.red) > 255 ||
      parseInt(appNotificationSettings.txtColor.green) < 0 ||
      parseInt(appNotificationSettings.txtColor.green) > 255 ||
      parseInt(appNotificationSettings.txtColor.blue) < 0 ||
      parseInt(appNotificationSettings.txtColor.blue) > 255
    ) {
      toast.error('Button and Text color must be between 0 and 255');
      return;
    }

    if (appNotificationSettings.btnText.length === 0) {
      setErrors((prev) => ({
        ...prev,
        btnText: 'Button Text content is required',
      }));
    }

    if (appNotificationSettings.text.length === 0) {
      setErrors((prev) => ({
        ...prev,
        text: 'Text content is required',
      }));
    }

    if (
      appNotificationSettings.btnText.length > 0 &&
      appNotificationSettings.text.length > 0
    ) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      containerClassName="flex flex-col bg-white dark:bg-boxdark p-6"
      customSize="850px"
    >
      <div className="flex flex-col sm:flex-row gap-8">
        <div className="flex flex-col w-full sm:w-[40%]">
          <Select
            label="Popup Location"
            options={popupSettings.map((setting: string) => ({
              key: 'popupLocation',
              value: setting,
              label: setting,
            }))}
            labelClassName="text-black dark:text-bodydark"
            selectClassName="border-[1.5px] border-stroke ring-0 dark:border-form-strokedark"
            value={appNotificationSettings.popupLocation}
            onChange={handleSelectChange}
          />
          <Select
            label="Popup Redirect Path"
            options={popupSettings.map((setting: string) => ({
              key: 'popupRedirectPath',
              value: setting,
              label: setting,
            }))}
            className="mt-4"
            labelClassName="text-black dark:text-bodydark"
            selectClassName="border-[1.5px] border-stroke ring-0 dark:border-form-strokedark"
            value={appNotificationSettings.popupRedirectPath}
            onChange={handleSelectChange}
          />
          <span className="text-sm text-black dark:text-bodydark font-medium mt-4">
            Button Color
          </span>
          <div className="flex flex-row items-center gap-2 mt-2">
            <Input
              size="sm"
              inputMode="decimal"
              value={appNotificationSettings.btnColor.red}
              onChange={(e) =>
                handleChange('btnColor.red', parseInt(e.target.value) || 0)
              }
              className="w-10 [&_.rizzui-input-container]:bg-transparent dark:text-bodydark"
              inputClassName="border-[1.5px] border-stroke ring-0 dark:border-form-strokedark"
            />
            <span className="text-lg text-black dark:text-bodydark">-</span>
            <Input
              size="sm"
              inputMode="decimal"
              value={appNotificationSettings.btnColor.green}
              onChange={(e) =>
                handleChange('btnColor.green', parseInt(e.target.value) || 0)
              }
              className="w-10 [&_.rizzui-input-container]:bg-transparent dark:text-bodydark"
              inputClassName="border-[1.5px] border-stroke ring-0 dark:border-form-strokedark"
            />
            <span className="text-lg text-black dark:text-bodydark">-</span>
            <Input
              size="sm"
              inputMode="decimal"
              value={appNotificationSettings.btnColor.blue}
              onChange={(e) =>
                handleChange('btnColor.blue', parseInt(e.target.value) || 0)
              }
              className="w-10 [&_.rizzui-input-container]:bg-transparent dark:text-bodydark"
              inputClassName="border-[1.5px] border-stroke ring-0 dark:border-form-strokedark"
            />
          </div>
          <span className="text-sm text-black dark:text-bodydark font-medium mt-4">
            Text Color
          </span>
          <div className="flex flex-row items-center gap-2 mt-2">
            <Input
              size="sm"
              inputMode="decimal"
              value={appNotificationSettings.txtColor.red}
              onChange={(e) =>
                handleChange('txtColor.red', parseInt(e.target.value) || 0)
              }
              className="w-10 [&_.rizzui-input-container]:bg-transparent dark:text-bodydark"
              inputClassName="border-[1.5px] border-stroke ring-0 dark:border-form-strokedark"
            />
            <span className="text-lg text-black dark:text-bodydark">-</span>
            <Input
              size="sm"
              inputMode="decimal"
              value={appNotificationSettings.txtColor.green}
              onChange={(e) =>
                handleChange('txtColor.green', parseInt(e.target.value) || 0)
              }
              className="w-10 [&_.rizzui-input-container]:bg-transparent dark:text-bodydark"
              inputClassName="border-[1.5px] border-stroke ring-0 dark:border-form-strokedark"
            />
            <span className="text-lg text-black dark:text-bodydark">-</span>
            <Input
              size="sm"
              inputMode="decimal"
              value={appNotificationSettings.txtColor.blue}
              onChange={(e) =>
                handleChange('txtColor.blue', parseInt(e.target.value) || 0)
              }
              className="w-10 [&_.rizzui-input-container]:bg-transparent dark:text-bodydark"
              inputClassName="border-[1.5px] border-stroke ring-0 dark:border-form-strokedark"
            />
          </div>
          <Input
            label="Button Text Content"
            value={appNotificationSettings.btnText}
            onChange={(e) => {
              handleChange('btnText', e.target.value);
              if (e.target.value.length === 0) {
                setErrors((prev) => ({
                  ...prev,
                  btnText: 'Text content is required',
                }));
              } else {
                setErrors((prev) => ({
                  ...prev,
                  btnText: '',
                }));
              }
            }}
            className="[&_.rizzui-input-container]:bg-transparent dark:text-bodydark mt-4"
            labelClassName="text-black dark:text-bodydark"
            inputClassName="border-[1.5px] border-stroke ring-0 dark:border-form-strokedark"
            error={errors.btnText}
            errorClassName="text-xs text-red-500 ml-2 mt-1"
          />
          <Input
            label="Text Content"
            value={appNotificationSettings.text}
            onChange={(e) => {
              handleChange('text', e.target.value);
              if (e.target.value.length === 0) {
                setErrors((prev) => ({
                  ...prev,
                  text: 'Text content is required',
                }));
              } else {
                setErrors((prev) => ({
                  ...prev,
                  text: '',
                }));
              }
            }}
            className="[&_.rizzui-input-container]:bg-transparent dark:text-bodydark mt-3"
            labelClassName="text-black dark:text-bodydark"
            inputClassName="border-[1.5px] border-stroke ring-0 dark:border-form-strokedark"
            error={errors.text}
            errorClassName="text-xs text-red-500 ml-2 mt-1"
          />
          <Select
            label="Text Position"
            options={textPositions.map((setting: string) => ({
              key: 'textPosition',
              value: setting,
              label: setting,
            }))}
            className="mt-4"
            labelClassName="text-black dark:text-bodydark"
            selectClassName="border-[1.5px] border-stroke ring-0 dark:border-form-strokedark"
            value={appNotificationSettings.textPosition}
            onChange={handleSelectChange}
          />
          <Button
            className="text-white mt-4 gap-2"
            onClick={() => {
              document.getElementById('file-input')?.click();
            }}
          >
            <MdDriveFolderUpload className="w-5 h-5" />
            Upload Picture
          </Button>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const imgUrl = URL.createObjectURL(file);
                setPreviewImgURL(imgUrl);
                setAppNotificationSettings((prev: any) => ({
                  ...prev,
                  imgFile: file,
                }));
              }
            }}
            className="hidden"
            id="file-input"
          />
        </div>
        <div className="w-full sm:w-[60%]">
          <div className="flex flex-col bg-stroke p-4 rounded-lg">
            {appNotificationSettings.imgFile ? (
              <div className="flex justify-center">
                <img
                  className="w-fit h-20 border border-dashed border-gray-500 p-3"
                  src={previewImgURL}
                />
              </div>
            ) : (
              <div className="text-center border border-dashed border-gray-500 rounded-sm py-6">
                <span className="text-black dark:text-bodydark">
                  Image goes here
                </span>
              </div>
            )}
            <div className="flex justify-center mt-4">
              <span
                className="font-medium"
                style={{
                  color: `rgb(${appNotificationSettings.txtColor.red}, ${appNotificationSettings.txtColor.green}, ${appNotificationSettings.txtColor.blue})`,
                }}
              >
                {appNotificationSettings.text}
              </span>
            </div>
            {appNotificationSettings.btnText.length > 0 && (
              <div className="flex justify-center mt-4 text-white">
                <Button
                  style={{
                    backgroundColor: `rgb(${appNotificationSettings.btnColor.red}, ${appNotificationSettings.btnColor.green}, ${appNotificationSettings.btnColor.blue})`,
                  }}
                >
                  {appNotificationSettings.btnText}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-3">
        <Button
          variant="outline"
          className="border-gray-200 dark:border-form-strokedark hover:text-black dark:hover:text-white px-6"
          onClick={() => {
            setAppNotificationSettings({
              popupLocation: 'Initialization',
              popupRedirectPath: 'Initialization',
              btnColor: {
                red: 0,
                green: 0,
                blue: 0,
              },
              txtColor: {
                red: 0,
                green: 0,
                blue: 0,
              },
              btnText: '',
              text: '',
              textPosition: 'Top Left',
              imgUrl: null,
            });
            onClose();
          }}
        >
          Cancel
        </Button>
        <Button
          disabled={!!errors.btnText || !!errors.text}
          className="text-white gap-2 hover:bg-primary/90"
          onClick={handleSaveSettings}
        >
          Save In App Notification
        </Button>
      </div>
    </Modal>
  );
};

export default AppNotificationModal;
