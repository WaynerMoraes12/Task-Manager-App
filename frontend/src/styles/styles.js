import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // ===== ESTILOS DE AUTENTICAÇÃO =====
  authContainer: { 
    flex: 1, 
    backgroundColor: '#f8f9fa',
    justifyContent: 'center', 
    padding: 20 
  },
  authContent: { 
    flex: 1, 
    justifyContent: 'center' 
  },
  authHeader: { 
    alignItems: 'center', 
    marginBottom: 40 
  },
  authLogo: { 
    fontSize: 80, 
    marginBottom: 10,
    color: '#007AFF'
  },
  authTitle: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: '#333', 
    marginBottom: 8,
    textAlign: 'center'
  },
  authSubtitle: { 
    fontSize: 16, 
    color: '#666', 
    textAlign: 'center'
  },
  authForm: { 
    backgroundColor: '#fff', 
    borderRadius: 16, 
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4
  },
  formLabel: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#333', 
    marginBottom: 8 
  },
  authInput: { 
    backgroundColor: '#f8f9fa', 
    borderRadius: 12, 
    paddingHorizontal: 16, 
    paddingVertical: 14, 
    marginBottom: 16, 
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    color: '#333'
  },
  codeInput: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    letterSpacing: 10,
    color: '#333'
  },
  authButton: { 
    backgroundColor: '#007AFF', 
    borderRadius: 12, 
    paddingVertical: 16, 
    alignItems: 'center', 
    marginTop: 10 
  },
  authButtonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  buttonDisabled: { 
    backgroundColor: '#ccc' 
  },
  backLink: { 
    marginTop: 20, 
    alignItems: 'center' 
  },
  backLinkText: { 
    color: '#007AFF', 
    fontSize: 14,
    fontWeight: '600'
  },
  authFooter: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginTop: 20 
  },
  footerText: { 
    color: '#666', 
    fontSize: 14 
  },
  footerLink: { 
    color: '#007AFF', 
    fontSize: 14, 
    fontWeight: '600',
    marginLeft: 4
  },

  // ===== ESTILOS DO APP PRINCIPAL =====
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa' 
  },
  
  // Header
  header: { 
    backgroundColor: '#007AFF', 
    paddingVertical: 16 
  },
  headerContent: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: 20
  },
  headerTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#fff' 
  },
  logoutButton: { 
    backgroundColor: '#ff3b30', 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 8 
  },
  logoutButtonText: { 
    color: '#fff', 
    fontWeight: '600', 
    fontSize: 14 
  },
  userInfo: { 
    backgroundColor: '#0066dd', 
    paddingHorizontal: 20, 
    paddingVertical: 12 
  },
  userInfoText: { 
    color: '#fff', 
    fontSize: 14, 
    fontWeight: '500' 
  },

  // Navigation
  navigation: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    borderBottomWidth: 1, 
    borderBottomColor: '#e0e0e0' 
  },
  navButton: { 
    flex: 1, 
    paddingVertical: 12, 
    alignItems: 'center' 
  },
  navButtonActive: { 
    backgroundColor: '#007AFF' 
  },
  navButtonIcon: { 
    fontSize: 24, 
    marginBottom: 4,
    color: '#666'
  },
  navButtonIconActive: {
    color: '#fff'
  },
  navButtonText: { 
    fontSize: 11, 
    fontWeight: '600', 
    color: '#666' 
  },
  navButtonTextActive: { 
    color: '#fff' 
  },

  // ===== ESTILOS DAS TELAS =====
  content: { 
    flex: 1, 
    padding: 16 
  },
  screenHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  screenTitle: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  addButton: { 
    backgroundColor: '#007AFF', 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: 8 
  },
  addButtonText: { 
    color: '#fff', 
    fontWeight: '600', 
    fontSize: 14 
  },

  // Lists Screen
  listsContainer: {
    flex: 1
  },
  listsScrollView: {
    paddingVertical: 8
  },
  listContainer: { 
    width: 320, 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    padding: 16, 
    marginRight: 16, 
    height: 550,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  listHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 12 
  },
  listTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  listAddButton: { 
    backgroundColor: '#007AFF', 
    borderRadius: 20, 
    padding: 6 
  },
  listAddButtonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  taskList: { 
    flex: 1 
  },
  taskCard: { 
    backgroundColor: '#f8f9fa', 
    borderRadius: 10, 
    padding: 14, 
    marginBottom: 10, 
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF'
  },
  taskHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 8 
  },
  taskTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#333',
    flex: 1
  },
  taskTitleCompleted: { 
    textDecorationLine: 'line-through', 
    color: '#999' 
  },
  taskDescription: { 
    fontSize: 14, 
    color: '#666', 
    marginBottom: 8 
  },
  deadlineBadge: { 
    alignSelf: 'flex-start', 
    borderRadius: 12, 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    marginBottom: 8,
    backgroundColor: '#ffd700'
  },
  deadlineText: { 
    fontSize: 12, 
    fontWeight: '600',
    color: '#333'
  },
  taskResponsible: { 
    fontSize: 13, 
    color: '#555', 
    marginBottom: 8,
    fontStyle: 'italic'
  },
  completeButton: { 
    backgroundColor: '#34c759', 
    borderRadius: 8, 
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center' 
  },
  completeButtonText: { 
    color: '#fff', 
    fontWeight: '600',
    fontSize: 12
  },
  completedBadge: { 
    backgroundColor: '#e0e0e0', 
    borderRadius: 8, 
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center' 
  },
  completedText: { 
    color: '#666', 
    fontWeight: '600',
    fontSize: 12
  },

  // ChatBot Screen
  chatContainer: {
    flex: 1
  },
  chatMessages: { 
    flex: 1, 
    marginBottom: 16 
  },
  chatEmpty: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 50 
  },
  chatEmptyTitle: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#333', 
    marginBottom: 10 
  },
  chatEmptySubtitle: { 
    fontSize: 16, 
    color: '#666',
    textAlign: 'center'
  },
  chatBubble: { 
    maxWidth: '80%', 
    borderRadius: 16, 
    padding: 12, 
    marginVertical: 5 
  },
  chatBubbleUser: { 
    backgroundColor: '#007AFF', 
    alignSelf: 'flex-end', 
    borderBottomRightRadius: 4 
  },
  chatBubbleBot: { 
    backgroundColor: '#e9ecef', 
    alignSelf: 'flex-start', 
    borderBottomLeftRadius: 4 
  },
  chatText: { 
    fontSize: 16 
  },
  chatTextUser: { 
    color: '#fff' 
  },
  chatTextBot: { 
    color: '#333' 
  },
  chatInputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center',
    paddingHorizontal: 8
  },
  chatInput: { 
    flex: 1, 
    backgroundColor: '#fff', 
    borderRadius: 25, 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    fontSize: 16, 
    borderWidth: 1, 
    borderColor: '#ddd' 
  },
  chatSendButton: { 
    marginLeft: 10, 
    backgroundColor: '#007AFF', 
    borderRadius: 25, 
    padding: 12 
  },
  chatSendButtonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },

  // Dashboard Screen
  dashboardContainer: {
    flex: 1
  },
  statsGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between' 
  },
  statCard: { 
    width: '48%', 
    backgroundColor: '#fff',
    borderRadius: 12, 
    padding: 20, 
    marginBottom: 15, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  statIcon: { 
    fontSize: 30, 
    marginBottom: 10 
  },
  statNumber: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  statLabel: { 
    fontSize: 14, 
    color: '#666',
    textAlign: 'center'
  },

  // ===== ESTILOS DO MODAL =====
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  modalContent: { 
    width: '90%', 
    backgroundColor: '#fff', 
    borderRadius: 16, 
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#333', 
    marginBottom: 20, 
    textAlign: 'center' 
  },
  input: { 
    backgroundColor: '#f8f9fa', 
    borderRadius: 12, 
    paddingHorizontal: 16, 
    paddingVertical: 14, 
    marginBottom: 16, 
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    color: '#333'
  },
  textArea: { 
    height: 80, 
    textAlignVertical: 'top' 
  },
  modalButtons: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginTop: 10
  },
  modalButton: { 
    flex: 1, 
    paddingVertical: 14, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginHorizontal: 5 
  },
  modalButtonPrimary: { 
    backgroundColor: '#007AFF' 
  },
  modalButtonTextPrimary: { 
    color: '#fff', 
    fontWeight: '600' 
  },
  modalButtonSecondary: { 
    backgroundColor: '#e9ecef' 
  },
  modalButtonTextSecondary: { 
    color: '#333', 
    fontWeight: '600' 
  }
});

export default styles;