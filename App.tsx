import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Alert, Platform, KeyboardAvoidingView, ActivityIndicator } from 'react-native';

// CONFIGURAÇÃO DA API
const API_URL = 'http://localhost:3000/api';
const CHATBOT_URL = 'http://localhost:5001';

interface Task { id: string; title: string; description: string; deadline: string; responsible: string; status: string; }
interface List { id: string; title: string; tasks: Task[]; }
interface Board { id: string; title: string; lists: List[]; userId: string; }
interface ChatMessage { text: string; sender: 'user' | 'bot'; }
interface User { id: string; email: string; name: string; }

const showAlert = (title: string, message: string, onOk?: () => void) => {
  if (Platform.OS === 'web') {
    const confirmed = window.confirm(`${title}\n\n${message}`);
    if (confirmed && onOk) onOk();
  } else {
    Alert.alert(title, message, onOk ? [{ text: 'OK', onPress: onOk }] : undefined);
  }
};

const showConfirm = (title: string, message: string, onConfirm: () => void) => {
  if (Platform.OS === 'web') {
    const confirmed = window.confirm(`${title}\n\n${message}`);
    if (confirmed) onConfirm();
  } else {
    Alert.alert(title, message, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'OK', onPress: onConfirm }
    ]);
  }
};

export default function App() {
  const [authStep, setAuthStep] = useState<'login' | 'verify' | 'authenticated'>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginName, setLoginName] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [currentScreen, setCurrentScreen] = useState<'lists' | 'chatbot' | 'dashboard'>('lists');
  const [boards, setBoards] = useState<Board[]>([]);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'list' | 'task'>('list');
  const [selectedList, setSelectedList] = useState<List | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDeadline, setFormDeadline] = useState('');
  const [formResponsible, setFormResponsible] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    if (authStep === 'authenticated' && currentUser) {
      loadBoards();
    }
  }, [authStep, currentUser]);

  const handleSendCode = async () => {
    if (!loginEmail.trim() || !loginName.trim()) {
      showAlert('Erro', 'Preencha seu nome e email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginEmail)) {
      showAlert('Erro', 'Digite um email válido');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/send-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, name: loginName })
      });

      const data = await response.json();
      
      if (data.success) {
        showAlert(
          '📧 Código Enviado!',
          `Código: ${data.code}\n\nDigite este código na próxima tela`,
          () => setAuthStep('verify')
        );
      } else {
        showAlert('Erro', data.message);
      }
    } catch (error) {
      showAlert('Erro', 'Backend não está rodando! Inicie: cd backend && npm run dev');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      showAlert('Erro', 'Digite o código');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, code: verificationCode })
      });

      const data = await response.json();
      
      if (data.success) {
        setCurrentUser(data.user);
        setAuthStep('authenticated');
        setVerificationCode('');
        showAlert('Bem-vindo!', `Olá, ${data.user.name}! 🎉`);
      } else {
        showAlert('Erro', data.message);
      }
    } catch (error) {
      showAlert('Erro', 'Não foi possível verificar');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadBoards = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/boards?userId=${currentUser.id}`);
      const data = await response.json();
      
      if (data.success) {
        setBoards(data.data);
        if (data.data.length > 0) {
          setSelectedBoard(data.data[0]);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar quadros:', error);
    } finally {
      setLoading(false);
    }
  };

  const createList = async () => {
    if (!formTitle.trim() || !selectedBoard) {
      showAlert('Erro', 'Digite o nome da lista');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/boards/${selectedBoard.id}/lists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: formTitle })
      });

      const data = await response.json();
      
      if (data.success) {
        setSelectedBoard(data.board);
        setBoards(boards.map(b => b.id === data.board.id ? data.board : b));
        closeModal();
        showAlert('Sucesso', 'Lista criada!');
      }
    } catch (error) {
      showAlert('Erro', 'Não foi possível criar');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async () => {
    if (!formTitle.trim() || !selectedList || !selectedBoard) {
      showAlert('Erro', 'Preencha o título');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/boards/${selectedBoard.id}/lists/${selectedList.id}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formTitle,
          description: formDescription,
          deadline: formDeadline,
          responsible: formResponsible || currentUser?.name || 'Você'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setSelectedBoard(data.board);
        setBoards(boards.map(b => b.id === data.board.id ? data.board : b));
        closeModal();
        showAlert('Sucesso', 'Tarefa criada!');
      }
    } catch (error) {
      showAlert('Erro', 'Não foi possível criar');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const markTaskAsCompleted = async (listId: string, taskId: string) => {
    if (!selectedBoard) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/boards/${selectedBoard.id}/lists/${listId}/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' })
      });

      const data = await response.json();
      
      if (data.success) {
        setSelectedBoard(data.board);
        setBoards(boards.map(b => b.id === data.board.id ? data.board : b));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (listId: string, taskId: string) => {
    if (!selectedBoard) return;

    showConfirm('Confirmar', 'Deletar tarefa?', async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/boards/${selectedBoard.id}/lists/${listId}/tasks/${taskId}`, {
          method: 'DELETE'
        });

        const data = await response.json();
        
        if (data.success) {
          setSelectedBoard(data.board);
          setBoards(boards.map(b => b.id === data.board.id ? data.board : b));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    });
  };

  const handleChatSend = async () => {
    if (!chatInput.trim() || !currentUser) return;

    const userMessage = chatInput;
    setChatMessages([...chatMessages, { text: userMessage, sender: 'user' }]);
    setChatInput('');

    try {
      const response = await fetch(`${CHATBOT_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, userId: currentUser.id })
      });

      const data = await response.json();
      
      if (data.success) {
        setChatMessages(prev => [...prev, { text: data.reply, sender: 'bot' }]);
      }
    } catch (error) {
      setChatMessages(prev => [...prev, { text: 'Chatbot não está rodando! Inicie: cd chatbot && python chatbot.py', sender: 'bot' }]);
      console.error(error);
    }
  };

  const handleLogout = () => {
    showConfirm('Confirmar', 'Deseja sair?', () => {
      setAuthStep('login');
      setCurrentUser(null);
      setLoginEmail('');
      setLoginName('');
      setVerificationCode('');
      setBoards([]);
      setSelectedBoard(null);
      setCurrentScreen('lists');
      setChatMessages([]);
    });
  };

  const getDeadlineStatus = (deadline: string) => {
    if (!deadline) return { status: 'no-deadline', color: '#999', label: 'Sem prazo' };
    const deadlineDate = new Date(deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    deadlineDate.setHours(0, 0, 0, 0);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return { status: 'overdue', color: '#e74c3c', label: '⚠️ ATRASADA' };
    else if (diffDays === 0) return { status: 'today', color: '#f39c12', label: '⏰ HOJE' };
    else if (diffDays === 1) return { status: 'tomorrow', color: '#f39c12', label: '⏰ AMANHÃ' };
    else if (diffDays <= 3) return { status: 'soon', color: '#f39c12', label: `📅 ${diffDays}d` };
    else return { status: 'on-time', color: '#27ae60', label: `📅 ${diffDays}d` };
  };

  const calculateDashboardData = () => {
    const allTasks = boards.flatMap(b => b.lists.flatMap(l => l.tasks));
    const overdue = allTasks.filter(t => getDeadlineStatus(t.deadline).status === 'overdue').length;
    const today = allTasks.filter(t => getDeadlineStatus(t.deadline).status === 'today').length;
    const soon = allTasks.filter(t => { const s = getDeadlineStatus(t.deadline).status; return s === 'tomorrow' || s === 'soon'; }).length;
    const completed = allTasks.filter(t => t.status === 'completed').length;
    return { overdue, today, soon, completed, total: allTasks.length };
  };

  const openModal = (type: 'list' | 'task', list?: List) => { setModalType(type); if (list) setSelectedList(list); setModalVisible(true); };
  const closeModal = () => { setModalVisible(false); setFormTitle(''); setFormDescription(''); setFormDeadline(''); setFormResponsible(''); setSelectedList(null); };

  // TELAS
  const renderLoginScreen = () => (
    <SafeAreaView style={styles.authContainer}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.authContent}>
        <View style={styles.authHeader}>
          <Text style={styles.authLogo}>📋</Text>
          <Text style={styles.authTitle}>Gerenciador de Tarefas</Text>
          <Text style={styles.authSubtitle}>Login com código por email</Text>
        </View>
        <View style={styles.authForm}>
          <Text style={styles.formLabel}>Nome</Text>
          <TextInput style={styles.authInput} value={loginName} onChangeText={setLoginName} placeholder="Seu nome" />
          <Text style={styles.formLabel}>Email</Text>
          <TextInput style={styles.authInput} value={loginEmail} onChangeText={setLoginEmail} placeholder="seu@email.com" keyboardType="email-address" autoCapitalize="none" />
          <TouchableOpacity style={[styles.authButton, loading && styles.buttonDisabled]} onPress={handleSendCode} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.authButtonText}>📧 Enviar Código</Text>}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );

  const renderVerifyScreen = () => (
    <SafeAreaView style={styles.authContainer}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.authContent}>
        <View style={styles.authHeader}>
          <Text style={styles.authLogo}>🔐</Text>
          <Text style={styles.authTitle}>Verificação</Text>
          <Text style={styles.authSubtitle}>Digite o código enviado</Text>
        </View>
        <View style={styles.authForm}>
          <Text style={styles.formLabel}>Código</Text>
          <TextInput style={[styles.authInput, styles.codeInput]} value={verificationCode} onChangeText={setVerificationCode} placeholder="000000" keyboardType="number-pad" maxLength={6} />
          <TouchableOpacity style={[styles.authButton, loading && styles.buttonDisabled]} onPress={handleVerifyCode} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.authButtonText}>✓ Verificar</Text>}
          </TouchableOpacity>
          <TouchableOpacity style={styles.backLink} onPress={() => setAuthStep('login')}>
            <Text style={styles.backLinkText}>← Voltar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );

  const renderListsScreen = () => (
    <View style={styles.content}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>📋 {selectedBoard?.title || 'Tarefas'}</Text>
        <TouchableOpacity style={styles.addListButton} onPress={() => openModal('list')}>
          <Text style={styles.addListButtonText}>+ Lista</Text>
        </TouchableOpacity>
      </View>
      {loading ? <ActivityIndicator size="large" color="#4a90e2" /> : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {selectedBoard?.lists.map(list => (
            <View key={list.id} style={styles.listContainer}>
              <View style={styles.listHeader}>
                <Text style={styles.listTitle}>{list.title}</Text>
                <TouchableOpacity style={styles.listAddButton} onPress={() => openModal('task', list)}>
                  <Text style={styles.listAddButtonText}>+</Text>
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.taskList}>
                {list.tasks.map(task => {
                  const deadlineStatus = getDeadlineStatus(task.deadline);
                  const isCompleted = task.status === 'completed';
                  return (
                    <View key={task.id} style={[styles.taskCard, { borderLeftColor: isCompleted ? '#999' : deadlineStatus.color, opacity: isCompleted ? 0.6 : 1 }]}>
                      <View style={styles.taskHeader}>
                        <Text style={[styles.taskTitle, isCompleted && styles.taskTitleCompleted]}>{task.title}</Text>
                        <TouchableOpacity onPress={() => deleteTask(list.id, task.id)}><Text>🗑️</Text></TouchableOpacity>
                      </View>
                      {task.description ? <Text style={styles.taskDescription}>{task.description}</Text> : null}
                      {task.deadline ? (
                        <View style={[styles.deadlineBadge, { backgroundColor: isCompleted ? '#e0e0e0' : deadlineStatus.color + '30' }]}>
                          <Text style={[styles.deadlineText, { color: isCompleted ? '#666' : deadlineStatus.color }]}>{task.deadline} - {deadlineStatus.label}</Text>
                        </View>
                      ) : null}
                      {task.responsible ? <Text style={styles.taskResponsible}>👤 {task.responsible}</Text> : null}
                      {!isCompleted ? (
                        <TouchableOpacity style={styles.completeButton} onPress={() => markTaskAsCompleted(list.id, task.id)}>
                          <Text style={styles.completeButtonText}>✓ Concluir</Text>
                        </TouchableOpacity>
                      ) : (
                        <View style={styles.completedBadge}><Text style={styles.completedText}>✓ Concluída</Text></View>
                      )}
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );

  const renderChatBotScreen = () => (
    <KeyboardAvoidingView style={styles.content} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={100}>
      <Text style={styles.screenTitle}>💬 Assistente</Text>
      <ScrollView style={styles.chatMessages}>
        {chatMessages.length === 0 ? (
          <View style={styles.chatEmpty}>
            <Text style={styles.chatEmptyTitle}>👋 Olá!</Text>
            <Text style={styles.chatEmptySubtitle}>Pergunte sobre suas tarefas</Text>
          </View>
        ) : (
          chatMessages.map((msg, idx) => (
            <View key={idx} style={[styles.chatBubble, msg.sender === 'user' ? styles.chatBubbleUser : styles.chatBubbleBot]}>
              <Text style={[styles.chatText, msg.sender === 'user' ? styles.chatTextUser : styles.chatTextBot]}>{msg.text}</Text>
            </View>
          ))
        )}
      </ScrollView>
      <View style={styles.chatInputContainer}>
        <TextInput style={styles.chatInput} value={chatInput} onChangeText={setChatInput} placeholder="Digite..." onSubmitEditing={handleChatSend} />
        <TouchableOpacity style={styles.chatSendButton} onPress={handleChatSend}><Text style={styles.chatSendButtonText}>➤</Text></TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );

  const renderDashboardScreen = () => {
    const data = calculateDashboardData();
    const total = data.total || 1;
    return (
      <ScrollView style={styles.content}>
        <Text style={styles.screenTitle}>📊 Dashboard</Text>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: '#fff' }]}><Text style={styles.statIcon}>📊</Text><Text style={styles.statNumber}>{data.total}</Text><Text style={styles.statLabel}>Total</Text></View>
          <View style={[styles.statCard, { backgroundColor: '#ffebee' }]}><Text style={styles.statIcon}>⚠️</Text><Text style={[styles.statNumber, { color: '#e74c3c' }]}>{data.overdue}</Text><Text style={styles.statLabel}>Atrasadas</Text></View>
          <View style={[styles.statCard, { backgroundColor: '#fff3e0' }]}><Text style={styles.statIcon}>⏰</Text><Text style={[styles.statNumber, { color: '#f39c12' }]}>{data.today}</Text><Text style={styles.statLabel}>Hoje</Text></View>
          <View style={[styles.statCard, { backgroundColor: '#fff9c4' }]}><Text style={styles.statIcon}>📅</Text><Text style={[styles.statNumber, { color: '#f39c12' }]}>{data.soon}</Text><Text style={styles.statLabel}>Próximos</Text></View>
          <View style={[styles.statCard, { backgroundColor: '#e8f5e9' }]}><Text style={styles.statIcon}>✓</Text><Text style={[styles.statNumber, { color: '#27ae60' }]}>{data.completed}</Text><Text style={styles.statLabel}>Concluídas</Text></View>
        </View>
      </ScrollView>
    );
  };

  if (authStep === 'login') return renderLoginScreen();
  if (authStep === 'verify') return renderVerifyScreen();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📋 Tarefas</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userInfoText}>👤 {currentUser?.name}</Text>
      </View>
      <View style={styles.navigation}>
        <TouchableOpacity style={[styles.navButton, currentScreen === 'lists' && styles.navButtonActive]} onPress={() => setCurrentScreen('lists')}>
          <Text style={styles.navButtonIcon}>📝</Text>
          <Text style={[styles.navButtonText, currentScreen === 'lists' && styles.navButtonTextActive]}>Listas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navButton, currentScreen === 'chatbot' && styles.navButtonActive]} onPress={() => setCurrentScreen('chatbot')}>
          <Text style={styles.navButtonIcon}>💬</Text>
          <Text style={[styles.navButtonText, currentScreen === 'chatbot' && styles.navButtonTextActive]}>ChatBot</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navButton, currentScreen === 'dashboard' && styles.navButtonActive]} onPress={() => setCurrentScreen('dashboard')}>
          <Text style={styles.navButtonIcon}>📊</Text>
          <Text style={[styles.navButtonText, currentScreen === 'dashboard' && styles.navButtonTextActive]}>Dashboard</Text>
        </TouchableOpacity>
      </View>
      {currentScreen === 'lists' && renderListsScreen()}
      {currentScreen === 'chatbot' && renderChatBotScreen()}
      {currentScreen === 'dashboard' && renderDashboardScreen()}
      <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{modalType === 'list' ? '➕ Nova Lista' : '➕ Nova Tarefa'}</Text>
            <TextInput style={styles.input} value={formTitle} onChangeText={setFormTitle} placeholder="Título" />
            {modalType === 'task' && (<>
              <TextInput style={[styles.input, styles.textArea]} value={formDescription} onChangeText={setFormDescription} placeholder="Descrição" multiline numberOfLines={3} />
              <TextInput style={styles.input} value={formDeadline} onChangeText={setFormDeadline} placeholder="Prazo (AAAA-MM-DD)" />
              <TextInput style={styles.input} value={formResponsible} onChangeText={setFormResponsible} placeholder={`Responsável`} />
            </>)}
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, styles.modalButtonPrimary, loading && styles.buttonDisabled]} onPress={() => modalType === 'list' ? createList() : createTask()} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.modalButtonTextPrimary}>Criar</Text>}
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.modalButtonSecondary]} onPress={closeModal}><Text style={styles.modalButtonTextSecondary}>Cancelar</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  authContainer: { flex: 1, backgroundColor: '#4a90e2' },
  authContent: { flex: 1, justifyContent: 'center', padding: 20 },
  authHeader: { alignItems: 'center', marginBottom: 40 },
  authLogo: { fontSize: 80, marginBottom: 10 },
  authTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
  authSubtitle: { fontSize: 16, color: '#fff', opacity: 0.9 },
  authForm: { backgroundColor: '#fff', borderRadius: 20, padding: 25 },
  formLabel: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  authInput: { backgroundColor: '#f5f7fa', borderRadius: 10, paddingHorizontal: 15, paddingVertical: 12, marginBottom: 15, fontSize: 16 },
  codeInput: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', letterSpacing: 10 },
  authButton: { backgroundColor: '#4a90e2', borderRadius: 10, paddingVertical: 15, alignItems: 'center', marginTop: 10 },
  authButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  buttonDisabled: { opacity: 0.6 },
  backLink: { marginTop: 15, alignItems: 'center' },
  backLinkText: { color: '#666', fontSize: 14 },
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  header: { backgroundColor: '#4a90e2', padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  logoutButton: { backgroundColor: '#e74c3c', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 },
  logoutButtonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  userInfo: { backgroundColor: '#3a7bc8', paddingHorizontal: 20, paddingVertical: 10 },
  userInfoText: { color: '#fff', fontSize: 13, fontWeight: '500' },
  navigation: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  navButton: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  navButtonActive: { backgroundColor: '#4a90e2', borderBottomWidth: 3, borderBottomColor: '#2e5c8a' },
  navButtonIcon: { fontSize: 24, marginBottom: 4 },
  navButtonText: { fontSize: 11, fontWeight: '600', color: '#666' },
  navButtonTextActive: { color: '#fff' },
  content: { flex: 1, padding: 15 },
  screenHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  screenTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  addListButton: { backgroundColor: '#27ae60', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 8 },
  addListButtonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  listContainer: { width: 320, backgroundColor: '#e8ecef', borderRadius: 12, padding: 15, marginRight: 15, height: 550 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  listTitle: {