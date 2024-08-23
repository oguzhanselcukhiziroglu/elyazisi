import React, { useState } from 'react';
import { Storage, API, graphqlOperation } from 'aws-amplify';
import { createHandwriting } from './graphql/mutations';
import { v4 as uuid } from 'uuid';

const HandwritingUpload = () => {
  const [personName, setPersonName] = useState('');
  const [personID, setPersonID] = useState('');
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const imageName = uuid() + '_' + file.name;
    const imageUrl = await Storage.put(imageName, file);

    const newHandwriting = {
      personName,
      personID,
      imageUrl: imageUrl.key,
    };

    await API.graphql(graphqlOperation(createHandwriting, { input: newHandwriting }));
    alert('El yazısı başarıyla yüklendi ve kaydedildi.');
  };

  return (
    <div>
      <h2>El Yazısı Yükle</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Kişinin Adı"
          value={personName}
          onChange={(e) => setPersonName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Kişinin ID'si"
          value={personID}
          onChange={(e) => setPersonID(e.target.value)}
          required
        />
        <input type="file" onChange={handleFileChange} required />
        <button type="submit">Yükle</button>
      </form>
    </div>
  );
};

export default HandwritingUpload
