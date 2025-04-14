import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import '../styles/simulator.css';

import camisaMockup from '../assets/mockup-camisa.png';
import calcaoMockup from '../assets/mockup-calcao.png';
import meiaoMockup from '../assets/mockup-meiao.png';

const modelos = {
  camisa: {
    nome: 'Camisa',
    partes: ['corpo', 'mangas', 'gola'],
    mockup: camisaMockup,
  },
  calcao: {
    nome: 'Calção',
    partes: ['corpo', 'lateral'],
    mockup: calcaoMockup,
  },
  meiao: {
    nome: 'Meião',
    partes: ['base', 'punho'],
    mockup: meiaoMockup,
  },
};

function UniformSimulator() {
  const [modeloSelecionado, setModeloSelecionado] = useState('camisa');
  const partes = modelos[modeloSelecionado].partes;

  const [selectedPart, setSelectedPart] = useState(partes[0]);
  const [colors, setColors] = useState({
    camisa: { corpo: '#ffffff', mangas: '#000000', gola: '#000000' },
    calcao: { corpo: '#ffffff', lateral: '#000000' },
    meiao: { base: '#ffffff', punho: '#000000' },
  });

  const [logo, setLogo] = useState(null);
  const [nome, setNome] = useState('');
  const [numero, setNumero] = useState('');

  const handleColorChange = (e) => {
    const value = e.target.value;
    setColors({
      ...colors,
      [modeloSelecionado]: {
        ...colors[modeloSelecionado],
        [selectedPart]: value,
      },
    });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogo(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const sendToWhatsApp = () => {
    const msg = encodeURIComponent(
      `🧢 Pedido de uniforme personalizado:
Modelo: ${modelos[modeloSelecionado].nome}

${Object.entries(colors[modeloSelecionado])
  .map(([parte, cor]) => `${parte}: ${cor}`)
  .join('\n')}

Nome: ${nome || '(não informado)'}
Número: ${numero || '(não informado)'}`
    );

    window.open(`https://wa.me/5511944429559?text=${msg}`, '_blank');
  };

  const exportarComoImagem = async () => {
    const previewElement = document.getElementById('uniform-preview');
    if (!previewElement) return;

    try {
      const canvas = await html2canvas(previewElement);
      const link = document.createElement('a');
      link.download = `uniforme-${modeloSelecionado}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (err) {
      console.error('Erro ao exportar imagem:', err);
      alert('Erro ao gerar imagem do uniforme.');
    }
  };

  return (
    <div className="simulator">
      <h2>Monte seu uniforme</h2>

      <div className="controls">
        <div className="modelo-select">
          <label>Modelo:</label>
          <select
            value={modeloSelecionado}
            onChange={(e) => {
              const novoModelo = e.target.value;
              setModeloSelecionado(novoModelo);
              setSelectedPart(modelos[novoModelo].partes[0]);
            }}
          >
            {Object.entries(modelos).map(([key, { nome }]) => (
              <option key={key} value={key}>
                {nome}
              </option>
            ))}
          </select>
        </div>

        <div className="part-select">
          <label>Parte:</label>
          <select
            value={selectedPart}
            onChange={(e) => setSelectedPart(e.target.value)}
          >
            {partes.map((parte) => (
              <option key={parte} value={parte}>
                {parte}
              </option>
            ))}
          </select>
        </div>

        <div className="color-picker">
          <label>Cor:</label>
          <input
            type="color"
            value={colors[modeloSelecionado][selectedPart]}
            onChange={handleColorChange}
          />
        </div>

        <div className="logo-upload">
          <label>Logo:</label>
          <input type="file" accept="image/*" onChange={handleLogoUpload} />
        </div>

        <div className="text-personalization">
          <label>Nome (costas):</label>
          <input
            type="text"
            maxLength={20}
            placeholder="Ex: LUCAS"
            value={nome}
            onChange={(e) => setNome(e.target.value.toUpperCase())}
          />

          <label>Número:</label>
          <input
            type="text"
            maxLength={2}
            placeholder="10"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
          />
        </div>

        <div className="buttons">
          <button onClick={sendToWhatsApp}>Enviar para WhatsApp</button>
          <button onClick={exportarComoImagem}>Baixar imagem</button>
        </div>
      </div>

      <div className="preview">
        <h3>Pré-visualização: {modelos[modeloSelecionado].nome}</h3>
        <div
          id="uniform-preview"
          className="shirt-preview"
          style={{
            backgroundColor:
              colors[modeloSelecionado][
                modelos[modeloSelecionado].partes.includes('corpo')
                  ? 'corpo'
                  : modelos[modeloSelecionado].partes[0]
              ],
          }}
        >
          {logo && <img src={logo} alt="Logo" className="logo-preview" />}
          {numero && <div className="numero-preview">{numero}</div>}
          {nome && <div className="nome-preview">{nome}</div>}
          <img
            src={modelos[modeloSelecionado].mockup}
            alt="Mockup"
            className="mockup-base"
          />
        </div>
      </div>
    </div>
  );
}

export default UniformSimulator;
