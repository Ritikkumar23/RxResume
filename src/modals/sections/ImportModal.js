import { Tooltip } from '@material-ui/core';
import Ajv from 'ajv';
import React, { memo, useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Button from '../../components/shared/Button';
import ModalContext from '../../contexts/ModalContext';
import { useDispatch } from '../../contexts/ResumeContext';
import reactiveResumeSchema from '../../data/schema/reactiveResume.json';
import jsonResumeSchema from '../../data/schema/jsonResume.json';
import BaseModal from '../BaseModal';

const ImportModal = () => {
  const ajv = new Ajv();
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const { emitter, events } = useContext(ModalContext);

  useEffect(() => {
    const unbind = emitter.on(events.IMPORT_MODAL, () => setOpen(true));

    return () => unbind();
  }, [emitter, events]);

  const importReactiveResumeJson = (event) => {
    const fr = new FileReader();
    fr.addEventListener('load', () => {
      const payload = JSON.parse(fr.result);
      const valid = ajv.validate(reactiveResumeSchema, payload);
      if (!valid) {
        ajv.errors.forEach((x) => toast.error(`Invalid Data: ${x.message}`));
        return;
      }
      dispatch({ type: 'on_import', payload });
      setOpen(false);
    });
    fr.readAsText(event.target.files[0]);
  };

  const importJsonResume = (event) => {
    const fr = new FileReader();
    fr.addEventListener('load', () => {
      const payload = JSON.parse(fr.result);
      const valid = ajv.validate(jsonResumeSchema, payload);
      if (!valid) {
        ajv.errors.forEach((x) => toast.error(`Invalid Data: ${x.message}`));
        return;
      }
      dispatch({ type: 'on_import_jsonresume', payload });
      setOpen(false);
    });
    fr.readAsText(event.target.files[0]);
  };

  return (
    <BaseModal
      hideActions
      state={[open, setOpen]}
      title={t('builder.actions.import.heading')}
    >
      <div>
        <h5 className="text-xl font-semibold mb-4">
          {t('modals.import.reactiveResume.heading')}
        </h5>

        <p className="leading-loose">
          {t('modals.import.reactiveResume.text')}
        </p>

        <Button className="mt-5" onClick={() => fileInputRef.current.click()}>
          {t('modals.import.button')}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={importReactiveResumeJson}
        />
      </div>

      <hr className="my-8" />

      <div>
        <h5 className="text-xl font-semibold mb-4">
          {t('modals.import.jsonResume.heading')}
        </h5>

        <p className="leading-loose">{t('modals.import.jsonResume.text')}</p>

        <Button className="mt-5" onClick={() => fileInputRef.current.click()}>
          {t('modals.import.button')}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={importJsonResume}
        />
      </div>

      <hr className="my-8" />

      <div>
        <h5 className="text-xl font-semibold mb-4">
          {t('modals.import.linkedIn.heading')}
        </h5>

        <p className="leading-loose">{t('modals.import.linkedIn.text')}</p>

        <Tooltip title="Coming Soon" placement="right" arrow>
          <div className="mt-5 inline-block">
            <Button className="opacity-50">{t('modals.import.button')}</Button>
          </div>
        </Tooltip>
      </div>
    </BaseModal>
  );
};

export default memo(ImportModal);