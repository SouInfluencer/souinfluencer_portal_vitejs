import { useState, useEffect } from 'react';
import { User, MapPin, CreditCard, ChevronRight, Check, ChevronDown } from 'lucide-react';
import { Button } from '../components/ui/Button';

// Rename the function to a PascalCase name and add default export
export default function MeuCadastro() {
  const [activeTab, setActiveTab] = useState('dados');
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    cpf: '',
    dataNascimento: '',
    telefone: '',
    cep: '',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    tipoConta: '',
    banco: '',
    agencia: '',
    numeroConta: ''
  });

  useEffect(() => {
    setProgress(calculateProgress());
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateProgress = () => {
    const fields = Object.values(formData);
    const filledFields = fields.filter(field => field !== '').length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted', formData);
      setIsSubmitting(false);
    }, 1500);
  };

  const tabs = [
    {
      id: 'dados',
      title: 'Dados Pessoais',
      icon: User,
      completed: formData.nome && formData.sobrenome && formData.cpf
    },
    {
      id: 'endereco',
      title: 'Endereço',
      icon: MapPin,
      completed: formData.cep && formData.rua && formData.numero
    },
    {
      id: 'bancarios',
      title: 'Dados Bancários',
      icon: CreditCard,
      completed: formData.banco && formData.agencia && formData.numeroConta
    }
  ];

  return (
      <div className="max-w-4xl mx-auto px-3 py-4">
        {/* Header */}
        <div className="mb-4 text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-1">Meu Cadastro</h1>
          <p className="text-xs text-gray-600">
            Complete seu cadastro para ter acesso a todos os recursos
          </p>
        </div>

        {/* Progress */}
        <div className="mb-4 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-700">Progresso</span>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
            {progress}%
          </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Mobile Tab Selector */}
        <div className="mb-3 block sm:hidden bg-white p-1 rounded-lg shadow-sm border border-gray-100 relative">
          <select
              onChange={(e) => handleTabChange(e.target.value)}
              value={activeTab}
              className="w-full pl-3 pr-8 py-2.5 text-sm font-medium rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-transparent"
          >
            {tabs.map(tab => (
                <option key={tab.id} value={tab.id} className="flex items-center gap-1">
                  {tab.title} {tab.completed && <Check size={12} className="inline ml-1" />}
                </option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {/* Desktop Tab Selector */}
        <div className="hidden sm:flex mb-3 bg-white rounded-lg shadow-sm border border-gray-100">
          {tabs.map((tab, index) => (
              <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`
              flex-1 flex items-center justify-center py-3 px-4 text-sm font-medium 
              transition-all duration-300 
              ${activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-500'
                      : 'text-gray-500 hover:bg-gray-50'}
              ${index < tabs.length - 1 ? 'border-r border-gray-100' : ''}
              relative
            `}
              >
                <tab.icon size={16} className="mr-2" />
                {tab.title}
                {tab.completed && (
                    <Check
                        size={14}
                        className="absolute top-2 right-2 text-blue-500"
                    />
                )}
              </button>
          ))}
        </div>

        {/* Form Sections */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          {/* Dados Pessoais */}
          {activeTab === 'dados' && (
              <div className="p-3 space-y-4">
                <div className="space-y-1">
                  <h2 className="text-base font-semibold text-gray-900">Informações Pessoais</h2>
                  <p className="text-xs text-gray-500">Preencha seus dados básicos</p>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Nome</label>
                    <input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Seu nome"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Sobrenome</label>
                    <input
                        type="text"
                        name="sobrenome"
                        value={formData.sobrenome}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Seu sobrenome"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">CPF</label>
                    <input
                        type="text"
                        name="cpf"
                        value={formData.cpf}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="000.000.000-00"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Data de Nascimento</label>
                    <input
                        type="date"
                        name="dataNascimento"
                        value={formData.dataNascimento}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Telefone</label>
                    <input
                        type="tel"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>
              </div>
          )}

          {/* Endereço */}
          {activeTab === 'endereco' && (
              <div className="p-3 space-y-4">
                <div className="space-y-1">
                  <h2 className="text-base font-semibold text-gray-900">Endereço</h2>
                  <p className="text-xs text-gray-500">Informe onde você reside</p>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">CEP</label>
                    <input
                        type="text"
                        name="cep"
                        value={formData.cep}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="00000-000"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Rua</label>
                    <input
                        type="text"
                        name="rua"
                        value={formData.rua}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nome da rua"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Número</label>
                    <input
                        type="text"
                        name="numero"
                        value={formData.numero}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Número"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Bairro</label>
                    <input
                        type="text"
                        name="bairro"
                        value={formData.bairro}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Bairro"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Cidade</label>
                    <input
                        type="text"
                        name="cidade"
                        value={formData.cidade}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Cidade"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Estado</label>
                    <select
                        name="estado"
                        value={formData.estado}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_0.75rem]"
                    >
                      <option value="">Selecione</option>
                      <option value="AC">Acre</option>
                      <option value="AL">Alagoas</option>
                      <option value="AP">Amapá</option>
                      <option value="AM">Amazonas</option>
                      <option value="BA">Bahia</option>
                      <option value="CE">Ceará</option>
                      <option value="DF">Distrito Federal</option>
                      <option value="ES">Espírito Santo</option>
                      <option value="GO">Goiás</option>
                      <option value="MA">Maranhão</option>
                      <option value="MT">Mato Grosso</option>
                      <option value="MS">Mato Grosso do Sul</option>
                      <option value="MG">Minas Gerais</option>
                      <option value="PA">Pará</option>
                      <option value="PB">Paraíba</option>
                      <option value="PR">Paraná</option>
                      <option value="PE">Pernambuco</option>
                      <option value="PI">Piauí</option>
                      <option value="RJ">Rio de Janeiro</option>
                      <option value="RN">Rio Grande do Norte</option>
                      <option value="RS">Rio Grande do Sul</option>
                      <option value="RO">Rondônia</option>
                      <option value="RR">Roraima</option>
                      <option value="SC">Santa Catarina</option>
                      <option value="SP">São Paulo</option>
                      <option value="SE">Sergipe</option>
                      <option value="TO">Tocantins</option>
                    </select>
                  </div>
                </div>
              </div>
          )}

          {/* Dados Bancários */}
          {activeTab === 'bancarios' && (
              <div className="p-3 space-y-4">
                <div className="space-y-1">
                  <h2 className="text-base font-semibold text-gray-900">Dados Bancários</h2>
                  <p className="text-xs text-gray-500">Informe os dados para recebimento</p>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Tipo de Conta</label>
                    <select
                        name="tipoConta"
                        value={formData.tipoConta}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_0.75rem]"
                    >
                      <option value="">Selecione</option>
                      <option value="corrente">Conta Corrente</option>
                      <option value="poupanca">Conta Poupança</option>
                      <option value="salario">Conta Salário</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Banco</label>
                    <input
                        type="text"
                        name="banco"
                        value={formData.banco}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nome do banco"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Agência</label>
                    <input
                        type="text"
                        name="agencia"
                        value={formData.agencia}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Número da agência"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Número da Conta</label>
                    <input
                        type="text"
                        name="numeroConta"
                        value={formData.numeroConta}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Número da conta"
                    />
                  </div>
                </div>
              </div>
          )}

          {/* Actions */}
          <div className="px-3 py-3 border-t border-gray-100 bg-gray-50 flex justify-between">
            {activeTab !== 'dados' && (
                <Button
                    variant="secondary"
                    onClick={() => {
                      if (activeTab === 'endereco') setActiveTab('dados');
                      if (activeTab === 'bancarios') setActiveTab('endereco');
                    }}
                    className="px-3"
                    size="sm"
                >
                  Voltar
                </Button>
            )}

            <Button
                variant="primary"
                onClick={() => {
                  if (activeTab === 'dados') setActiveTab('endereco');
                  if (activeTab === 'endereco') setActiveTab('bancarios');
                  if (activeTab === 'bancarios') handleSubmit();
                }}
                className="px-3 ml-auto"
                size="sm"
                loading={isSubmitting}
            >
              {activeTab === 'bancarios' ? 'Finalizar' : 'Continuar'}
              <ChevronRight size={14} className="ml-0.5" />
            </Button>
          </div>
        </div>
      </div>
  );
}
