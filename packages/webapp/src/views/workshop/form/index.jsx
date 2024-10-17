import {
  Avatar,
  Button,
  Card,
  Dialog,
  FormContainer,
  Input,
  Notification,
  toast,
  Upload,
  Select,
  FormItem
} from '@/components/ui'
import { saveWorkshop, updateWorkshop } from '@/services/workshop'
import _ from 'lodash'
import { useEffect, useRef, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { HiOutlineEye, HiOutlineTrash, HiOutlineUser } from 'react-icons/hi'
import { RiSave2Line } from 'react-icons/ri'
import FormRow from './FormRow'
import MapView from '@/components/ui/MapView'
import WorkshopList from '../list'
import { uploadFile } from '@/services/uploads'
import { S3_URL } from '@/constants/api.constant'
import { DoubleSidedImage } from '@/components/shared'

const UserForm = (props) => {
  const { isEdit = false, open = false, onClose, data = {}, RegionList, multipleAttachments = true } = props
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    reset,
  } = useForm({
    defaultValues: {
      workshop: {},
      WorkshopIds: [],
    },
  })

  const watcher = useWatch({ control })
  const [avatar, setAvatar] = useState(null)
  const [loading, setLoading] = useState(false)
  const [workshopForm, setWorkshopForm] = useState([])
  const [isWorkshopEdit, setIsWorkshopEdit] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [files, setFiles] = useState([])
  const [attachments, setAttachments] = useState([])

  const beforeUpload = (file) => {
    let valid = true

    const allowedFileType = [
      'image/jpeg',
      'image/png',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]
    const maxFileSize = 500000

    for (let f of file) {
      if (!allowedFileType.includes(f.type)) {
        valid = 'Please upload a .jpeg or .png file!'
      }

      if (f.size >= maxFileSize) {
        valid = 'Upload image cannot more then 500kb!'
      }
    }

    return valid
  }
 
  const handleFileUpload = async (files) => {
    setFiles(files)
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      try {
        const url = await uploadFile(file)
        setAttachments((prevAttachments) => [
          ...prevAttachments,
          { name: file.name, url },
        ])
        toast.push(
          <Notification className="mb-4" type="success">
            Upload Successfully
          </Notification>,
        )
      } catch (error) {
        toast.push(
          <Notification className="mb-4" type="danger">
            Upload Failed
          </Notification>,
        )
      }
    }
    setFiles([])
  }

  useEffect(() => {
    if (isEdit && data) {
      setIsWorkshopEdit(false);
      if (data?.id) {
        setAttachments(data?.workshopAttachments || []);

        const region = _.filter(
          RegionList,
          (row) => row.value === data.regionId,
        )
        const WorkshopIds = _.map(data, (workshop) => ({
          id: data.id,
          logo: workshop?.logo,
          name: workshop?.name,
          address: workshop?.address,
          regionId: region
        }));
  
        setValue('workshop', data);
        setValue('workshop', {
          id: data?.id,
          logo: data?.logo,
          name: data?.name,
          longitude: data?.longitude,
          lattitude: data?.lattitude,
          address: data?.address,
          regionId: region
        });
  
        setValue('WorkshopIds', WorkshopIds);
  
        setWorkshopForm(
          _.map(data, (workshop) => ({
            id: data.id,
            logo: workshop?.logo,
            name: workshop?.name,
            longitude: workshop?.longitude,
            lattitude: workshop?.lattitude,
            address: workshop?.address,
            regionId: region
          }))
        );
      }
    }
  }, [isEdit]);
  

  const handleDialogClose = () => {
    setTimeout(() => {
      reset({
        workshop: null,
        WorkshopIds: null,
      })
    }, 700)
    setAvatar(null)
    setIsWorkshopEdit(false)
    onClose()
    setWorkshopForm([])
  }

  const onSubmit = async (values) => {
    try {
      values.workshop.workshopAttachments = attachments
      values.workshop.regionId = values.workshop.regionId.value
      const save = data?.id ? updateWorkshop : saveWorkshop
      setLoading(true)
      const response = await save(values?.workshop, data?.id)
      setLoading(false)
      toast.push(
        <Notification className="mb-4" type="success">
         Workshop Created !
        </Notification>,
      )
      handleDialogClose()
      setAttachments([])
    } catch (error) {
      setLoading(false)
      toast.push(
        <Notification className="mb-4" type="danger">
          Failed !
        </Notification>,
      )
    }
  }

  const { t } = useTranslation()
  const [coordinates, setCoordinates] = useState(null)
  const autocompleteRef = useRef(null)
  const mapLat= coordinates?.lattitude;
  const mapLong= coordinates?.longitude;
  const handleSearch = async (selectedAddress) => {

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          selectedAddress,
        )}&key=AIzaSyAdH9leMSBBkt-9tefOxsFJGKM6CC7KkmQ`,
      )
            const data = await response.json()
      if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location
        setCoordinates({ lattitude: lat, longitude: lng })
        setValue('workshop.lattitude', lat)
        setValue('workshop.longitude', lng)
      } else {
        console.log('No results found')
      }
    } catch (error) {
      console.error(error)
    }
  }
  // const handlePlaceSelect = () => {
  //   const selectedAddress = autocompleteRef.current.value
  //   setValue('workshop.address', selectedAddress)
  //   handleSearch()
  // }
  const handlePlaceSelect = () => {
    const selectedAddress = autocompleteRef.current.value;
  
    // Set the selected address to the 'workshop.address' field
    setValue('workshop.address', selectedAddress);
  
    // Call the search function with the selected address
    handleSearch(selectedAddress);
  };
  const initializeAutocomplete = () => {
    const autocomplete = new window.google.maps.places.Autocomplete(
      autocompleteRef.current,
    )
    autocomplete.addListener('place_changed', handlePlaceSelect)
  }

  const loadGoogleMapsScript = () => {
    if (!window.google) {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAdH9leMSBBkt-9tefOxsFJGKM6CC7KkmQ&libraries=places`
      script.async = true
      script.onload = initializeAutocomplete
      document.head.appendChild(script)
    } else {
      initializeAutocomplete()
    }
  }
  const apiKey = 'AIzaSyAdH9leMSBBkt-9tefOxsFJGKM6CC7KkmQ'
  const lattitudes= WorkshopList.lattitude;


  const onSetFormFileUser = async (file) => {
		const response = await uploadFile(file[0]);
		const profilePic = response.data.name;
		setAvatar(`${S3_URL}/${profilePic}`);
		setValue("workshop.logo", profilePic);
	};

  return (
    <Dialog
      isOpen={open}
      onClose={handleDialogClose}
      onRequestClose={handleDialogClose}
      shouldCloseOnOverlayClick={false}
      contentClassName="bg-[#F3F4F6] px-0 py-0"
      bodyOpenClassName="overflow-hidden"
      width={1020}
    >
      <h3 className="p-4 dark:bg-gray-700 bg-white rounded-tl-lg rounded-tr-lg">
        {t('heading.Add New Workshop')}
      </h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContainer className="p-4">
          <div className="max-h-[65vh] overflow-y-auto ">
            <>
              <Card
                className="dark:bg-gray-700 bg-white mb-2"
                header={<h5>{t('heading.Workshop Details')}</h5>}
              >
                {isWorkshopEdit ? (
                  watcher.workshop?.id && (
                    <div className="text-left grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-y-7 gap-x-4">
                  <Upload
                    className="cursor-pointer text-center"
                    onChange={onSetFormFileUser}
                    onFileRemove={onSetFormFileUser}
                    showList={false}
                    uploadLimit={1}
                  >
                    <Avatar
                      src={avatar}
                      className="border-2 border-white dark:border-gray-800 shadow-lg"
                      size={100}
                      shape="circle"
                      icon={<HiOutlineUser />}
                    />
                  </Upload>
                </div>
                )
              ) : (
                <>
                  <FormRow label={t("label.Avatar")}>
										<Upload
											className="cursor-pointer"
											onChange={onSetFormFileUser}
											onFileRemove={onSetFormFileUser}
											showList={false}
											uploadLimit={1}
										>
											<Avatar
												src={avatar}
												className="border-2 border-white dark:border-gray-800 shadow-lg"
												size={50}
												shape="circle"
												icon={<HiOutlineUser />}
											/>
										</Upload>
									</FormRow>
                    <FormRow
                      label={t('label.Workshop Name')}
                      asterisk
                      invalid={errors.workshop?.name}
                      errorMessage="Workshop name is required!"
                    >
                      <Controller
                        control={control}
                        name="workshop.name"
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Input
                            type="text"
                            placeholder={t('label.Workshop Name')}
                            autocomplete="off"
                            {...field}
                          />
                        )}
                      />
                    </FormRow>
                    <FormRow
                      label={t('label.Address')}
                      asterisk
                      invalid={errors.workshop?.address}
                      errorMessage="Address is required!"
                    >
                      <Controller
                        control={control}
                        name="workshop.address"
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Input
                            type="text"
                            placeholder={t('label.Address')}
                            autocomplete="off"
                            {...field}
                            ref={autocompleteRef}
                          />
                        )}
                      />
                    </FormRow>
                    <FormRow
										label={t("label.Region")}
										asterisk
										border={false}
										invalid={errors.workshop?.regionId} 
										errorMessage="Region is required!"
									>
										<Controller
											control={control}
											rules={{ required: true }}
											name="workshop.regionId"
											render={({ field }) => (
												<Select
													isClearable
													{...field}
													placeholder={t("label.Select Region")}
													options={RegionList}
												/>
											)}
										/>
									</FormRow>
                  <FormItem
										label={t("label.Add Images")}
										asterisk
										border={false}
										errorMessage="Region is required!"
									>
									<Upload
                  className="min-h-fit mt-8"
                  disabled={uploading}
                  multiple={multipleAttachments}
                  uploadLimit={multipleAttachments}
                  beforeUpload={beforeUpload}
                  onChange={handleFileUpload}
                  showList={true}
                  fileList={files}
                  draggable
                >
                  <div className="max-w-full flex flex-col px-4 py-2 justify-center items-center">
                    <DoubleSidedImage
                      src="/img/others/upload.png"
                      darkModeSrc="/img/others/upload-dark.png"
                    />
                    <p className="font-semibold text-center text-gray-800 dark:text-white">
                      Upload
                    </p>
                  </div>
                </Upload>
                <div className="grid grid-cols-4 gap-4 mt-4">
                  {attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="bg-gray-100 p-4 rounded-md relative group"
                    >
                      {attachment.url.data.name.endsWith('.pdf') ? (
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/PDF_file_icon.svg/1200px-PDF_file_icon.svg.png"
                          alt="PDF Document"
                          className="w-full h-40"
                        />
                      ) : attachment.url.data.name.endsWith('.docx') ? (
                        <img
                          src="https://learnbrite.com/wp-content/uploads/2018/01/microsoft-word-365-online.png"
                          alt="Word Document"
                          className="w-full h-40"
                        />
                      ) : (
                        <img
                          src={`${S3_URL}/${attachment.url.data.name}`}
                          alt="Unknown Document"
                          className="w-full h-40"
                        />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-1 space-x-3 bg-white bg-opacity-75 rounded-md px-5 py-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-gray-500 hover:text-gray-700 cursor-pointer"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            onClick={() =>
                              window.open(
                                `${S3_URL}/${attachment.url.data.name}`,
                                '_blank',
                              )
                            }
                          >
                            <HiOutlineEye
                              size={22}
                              className="cursor-pointer p-2 hover:text-green-500"
                            />
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-gray-500 hover:text-red-500 cursor-pointer"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            onClick={() => {
                              const updatedAttachments = attachments.filter(
                                (_, i) => i !== index,
                              )
                              setAttachments(updatedAttachments)
                            }}
                          >
                            <HiOutlineTrash
                              size={22}
                              className="cursor-pointer p-2 hover:text-red-500"
                            />
                          </svg>
                        </div>
                      </div>
                      <p className="text-xs text-center">
                        <b>{attachment.name}</b>
                      </p>
                    </div>
                  ))}
                </div>
									</FormItem>
                  </>
                )}
                <div>
                  <h1 className='my-8'>Map View</h1>
                  <MapView  latitude={mapLat} longitude={mapLong}/>
                </div>
              </Card>
              <div>
                {apiKey ? (
                  loadGoogleMapsScript()
                ) : (
                  <p>Please provide your Google Maps API key.</p>
                )}
              </div>
            </>
          </div>
        </FormContainer>
        <div className="flex items-center justify-end dark:bg-gray-700 bg-white p-4 rounded-bl-lg rounded-br-lg">
          <Button
            type="button"
            size="sm"
            className="w-50 mr-2"
            onClick={handleDialogClose}
          >
            {t('button.Cancel')}
          </Button>
          <Button
            icon={<RiSave2Line />}
            type="submit"
            variant="solid"
            size="sm"
            className="w-50"
            loading={loading}
          >
            {isEdit ? t('button.Update') : t('button.Save')}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
export default UserForm
