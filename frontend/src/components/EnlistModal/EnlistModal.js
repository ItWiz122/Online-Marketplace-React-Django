import React, { useState } from "react";
import "./EnlistModal.scss";
import { useUserContext } from '../../context/UserContext';
import Modal from '../Modal/Modal';
import Form from '../Form/Form';
import Fields from '../Fields/Fields';
import { useTranslation } from 'react-i18next';
import Button from '../Button/Button';
import API from '../../shared/api';
import { FaTwitter, FaFacebook, FaLinkedin, FaInstagram } from 'react-icons/fa'

const social = [
  { icon: <FaTwitter />, link: 'https://twitter.com/covexit' },
  { icon: <FaInstagram />, link: 'https://www.instagram.com/covexit_de/' },
  { icon: <FaLinkedin />, link: 'https://www.linkedin.com/company/wearecovexit' },
  { icon: <FaFacebook />, link: 'https://www.facebook.com/Covexit/' },
];

const EnlistModal = () => {
  const { enlisted, enlist } = useUserContext();
  const [ showModal, setShowModal ] = useState(true);
  const [ data, setData ] = useState({
    name: '',
    email: '',
    accepted_privacy_policy: false,
    message: []
  });
  const [t] = useTranslation(['mailing-list', 'new-store-owner']);

  const changeHandler = (event) => setData({...data, [event.target.name]: event.target.checked || event.target.value });

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await API.mailingList.post(data);
      setData({...data, message: t('mailing-list:success')});
      dontShowAgain();
    }
    catch (e) {
      setData({...data, message: Object.values(e.response.data)});
    }
  };

  const dontShowAgain = () => {
    enlist(true);
    setShowModal(false);
  };

  return !enlisted && showModal && <div className="EnlistModal">
    <Modal onClose={() => setShowModal(false)}
           header={<><h2>{t('mailing-list:head')}</h2><p>{t('mailing-list:text')}</p></>}
           footer={
      <div className="Enlist__social">
        <p>{t('mailing-list:social')}</p>
        <ul className="Enlist__social-links">
          {social.map(item => <li key={item.link}><a href={item.link} target="_blank" rel="noopener noreferrer">{item.icon}</a></li>)}
        </ul>
      </div>
    }>
      <Form onSubmit={submitHandler}
        body={<>
          <Fields.TextInput onChange={changeHandler} placeholder={t('mailing-list:name')} name="name" value={data.name}/>
          <Fields.TextInput onChange={changeHandler} placeholder={t('mailing-list:email')} name="email" value={data.email} type="email"/>
          <Fields.CheckBox onChange={changeHandler} name="accepted_privacy_policy" checked={data.accepted_privacy_policy}
                           placeholder={t('new-store-owner:privacy')}/>
          {(data.message && <p>{data.message}</p>) || ''}
        </>}
        footer={<>
          <Button label={t('new-store-owner:Next')}/>
          <Button label={t('mailing-list:dontShowAgain')} type="dismiss" onClick={dontShowAgain}/>
        </>}
      />
    </Modal>
  </div>
};

export default EnlistModal;






