import {useEffect} from "react";

export const changeFieldValue = (form, name, value, index) => {
    if (name === 'bannerWeb') {
        form.setFieldsValue({bannerWeb: [value]});
    } else if (name === 'bannerRes') {
        form.setFieldsValue({bannerRes: value});
    } else if (name === 'exteriorReviewBanner') {

        const getValueBrand = form.getFieldValue('exteriorReview')
        getValueBrand.bannerImage = value
        form.setFieldsValue({
            exteriorReview: {
                ...getValueBrand,
            }
        });
    } else if (name === 'exteriorReviewListImage') {

        const getValueBrand = form.getFieldValue('exteriorReview')
        getValueBrand.list[index].image = value
        form.setFieldsValue({
            exteriorReview: {
                ...getValueBrand,
            }
        });
    } else if (name === 'interiorReviewBanner') {

        const getValueBrand = form.getFieldValue('interiorReview')
        getValueBrand.bannerImage = value
        form.setFieldsValue({
            interiorReview: {
                ...getValueBrand,
            }
        });
    } else if (name === 'interiorReviewListImage') {

        const getValueBrand = form.getFieldValue('interiorReview')
        console.log(getValueBrand)
        if (!getValueBrand.list.length){
            getValueBrand.list=[]
        }
        getValueBrand.list.push(value)
        form.setFieldsValue({
            interiorReview: {
                ...getValueBrand,
            }
        });
    } else if (name === 'equipmentImage') {

        const getValueBrand = form.getFieldValue('equipment')
        getValueBrand.image = value
        form.setFieldsValue({
            equipment: {
                ...getValueBrand,
            }
        });
    } else if (name === 'equipmentPdf') {

        const getValueBrand = form.getFieldValue('equipment')
        getValueBrand.pdf = value
        form.setFieldsValue({
            equipment: {
                ...getValueBrand,
            }
        });
    } else if (name === 'technicalCharacterImage') {

        const getValueBrand = form.getFieldValue('technicalCharacter')
        getValueBrand[index].image = value
        form.setFieldsValue({
            technicalCharacter: [
                ...getValueBrand,
            ]
        });
    } else if (name === 'imageHome') {
        form.setFieldsValue({imageHome: value});
    }
}

export const EditCar = (form, setFileListProps, editCarData, editCarSuccess) => {
    useEffect(() => {
        if (editCarSuccess) {
            const bannerWeb = [{
                uid: editCarData?.bannerWeb?._id,
                name: editCarData?.bannerWeb?.name,
                status: "done",
                url: `${process.env.REACT_APP_API_URL}/${editCarData?.bannerWeb?.path}`
            }];
            const bannerRes = [{
                uid: editCarData?.bannerRes?._id,
                name: editCarData?.bannerRes?.name,
                status: "done",
                url: `${process.env.REACT_APP_API_URL}/${editCarData.bannerRes?.path}`
            }];


            const exteriorReviewBanner = [{
                uid: editCarData?.exteriorReview?.bannerImage?._id,
                name: editCarData?.exteriorReview?.bannerImage?.name,
                status: "done",
                url: `${process.env.REACT_APP_API_URL}/${editCarData?.exteriorReview?.bannerImage?.path}`
            }];

            const exteriorReviewListImage = editCarData.exteriorReview.list.map(item => [{
                uid: item?.image?._id,
                name: item?.image?.name,
                status: "done",
                url: `${process.env.REACT_APP_API_URL}/${item?.image?.path}`
            }]);

            const interiorReviewBanner = [{
                uid: editCarData?.interiorReview?.bannerImage?._id,
                name: editCarData?.interiorReview?.bannerImage?.name,
                status: "done",
                url: `${process.env.REACT_APP_API_URL}/${editCarData?.interiorReview?.bannerImage?.path}`
            }];

            const interiorReviewListImage = editCarData.interiorReview.list.map(item => ({
                uid: item?._id,
                name: item?.name,
                status: "done",
                url: `${process.env.REACT_APP_API_URL}/${item?.path}`
            }));
            console.log(interiorReviewListImage)

            const equipmentImage = [{
                uid: editCarData?.equipment?.image?._id,
                name: editCarData?.equipment?.image?.name,
                status: "done",
                url: `${process.env.REACT_APP_API_URL}/${editCarData.equipment?.image?.path}`
            }];
            const equipmentPdf = [{
                uid: editCarData?.equipment?.pdf?._id,
                name: editCarData?.equipment?.pdf?.name,
                status: "done",
                url: `${process.env.REACT_APP_API_URL}/${editCarData?.equipment?.pdf?.path}`
            }];
            const technicalCharacterImage = editCarData.technicalCharacter.map(item => [{
                uid: item?.image?._id,
                name: item?.image?.name,
                status: "done",
                url: `${process.env.REACT_APP_API_URL}/${item?.image?.path}`
            }]);

            const imageHome = [{
                uid: editCarData?.imageHome?._id,
                name: editCarData?.imageHome?.name,
                status: "done",
                url: `${process.env.REACT_APP_API_URL}/${editCarData?.imageHome?.path}`
            }];


            const edit = {
                name: editCarData.name,
                modelDescriptionRu: editCarData.modelDescriptionRu,
                modelDescriptionUz: editCarData.modelDescriptionUz,
                bannerWeb,
                bannerRes,
                character: editCarData.character.map((item) => ({
                    keyRu: item.keyRu,
                    keyUz: item.keyUz,
                    valueRu: item.valueRu,
                    valueUz: item.valueUz,
                })),
                exteriorReview: {
                    textRu: editCarData.exteriorReview.textRu,
                    textUz: editCarData.exteriorReview.textUz,
                    bannerImage: exteriorReviewBanner,
                    list: editCarData.exteriorReview.list.map((item, index) => ({
                        titleRu: item.titleRu,
                        titleUz: item.titleUz,
                        textRu: item.textRu,
                        textUz: item.textUz,
                        image: exteriorReviewListImage[index]
                    }))
                },
                interiorReview: {
                    titleRu: editCarData.interiorReview.titleRu,
                    titleUz: editCarData.interiorReview.titleUz,
                    textRu: editCarData.interiorReview.textRu,
                    textUz: editCarData.interiorReview.textUz,
                    bannerImage: interiorReviewBanner,
                    list:interiorReviewListImage
                },
                equipment: {
                    image: equipmentImage,
                    pdf: equipmentPdf,
                    list: editCarData.equipment.list.map(item=>({
                        textRu: item.textRu,
                        textUz: item.textUz,
                    }))
                },
                technicalCharacter:editCarData.technicalCharacter.map((item,index)=>{
                   return {
                       image:technicalCharacterImage[index],
                       titleRu: item.titleRu,
                       titleUz: item.titleUz,
                       textRu:item.textRu,
                       textUz:item.textUz
                   }
                }),
                safety: editCarData.safety.map((item)=>{
                    return {
                        titleRu: item.titleRu,
                        titleUz: item.titleUz,
                        textRu: item.textRu,
                        textUz: item.textUz,
                    }
                }),
                isTestDrive: editCarData.isTestDrive,
                imageHome,

            };
            setFileListProps({
                    bannerWeb,
                    bannerRes,
                    exteriorReviewBanner,
                    exteriorReviewListImage,
                    interiorReviewBanner,
                    interiorReviewListImage,
                    equipmentImage,
                    equipmentPdf,
                    technicalCharacterImage,
                    imageHome,
                }
            );

            form.setFieldsValue(edit);
        }

    }, [editCarData])
}