<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <!-- Cabeçalho -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Gerenciador de Arquivos
        </h1>
        <p class="text-xl text-gray-600">
          Faça upload e gerencie seus arquivos com facilidade
        </p>
      </div>

      <!-- Lista de Arquivos -->
      <div class="bg-white rounded-lg shadow-sm border mb-8">
        <div class="p-6 border-b">
          <h2 class="text-2xl font-semibold text-gray-800">Arquivos Carregados</h2>
        </div>
        
        <div class="p-6">
          <!-- Loading inicial -->
          <div v-if="loading && files.length === 0" class="text-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p class="text-gray-500 mt-4">Carregando arquivos...</p>
          </div>

          <!-- Lista vazia -->
          <div v-else-if="files.length === 0" class="text-center py-8">
            <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p class="text-gray-500 text-lg mt-4">Nenhum arquivo encontrado</p>
          </div>

          <!-- Lista de arquivos -->
          <div v-else class="space-y-4">
            <div 
              v-for="file in files" 
              :key="file.name"
              class="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                  <img 
                    v-if="isImage(file.name)"
                    :src="getFileUrl(file.name)" 
                    :alt="file.name"
                    class="w-16 h-16 object-cover rounded-lg"
                  />
                  <div v-else class="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                
                <div>
                  <h3 class="font-medium text-gray-900">{{ file.name }}</h3>
                  <p class="text-sm text-gray-500">
                    {{ formatFileSize(file.size) }} • {{ formatDate(file.lastModified) }}
                  </p>
                </div>
              </div>

              <button
                @click="confirmDelete(file.name)"
                class="px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                :disabled="deletingFiles.includes(file.name)"
              >
                <span v-if="deletingFiles.includes(file.name)" class="flex items-center">
                  <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                  Removendo...
                </span>
                <span v-else>Remover</span>
              </button>
            </div>
          </div>

          <!-- Loading infinito -->
          <div v-if="loadingMore" class="text-center py-4">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p class="text-gray-500 mt-2">Carregando mais arquivos...</p>
          </div>

          <!-- Botão carregar mais (fallback se scroll infinito não funcionar) -->
          <div v-if="hasMore && !loadingMore" class="text-center py-4">
            <button
              @click="loadMoreFiles"
              class="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Carregar mais arquivos
            </button>
          </div>
        </div>
      </div>

      <!-- Upload de Arquivo -->
      <div class="bg-white rounded-lg shadow-sm border">
        <div class="p-6 border-b">
          <h2 class="text-2xl font-semibold text-gray-800">Upload de Imagem</h2>
        </div>
        
        <div class="p-6">
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              ref="fileInput"
              type="file"
              @change="handleFileSelect"
              accept="image/*"
              class="hidden"
            />
            
            <div v-if="!uploading">
              <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <p class="text-lg text-gray-600 mb-2">Selecione uma imagem para upload</p>
              <p class="text-sm text-gray-500 mb-4">PNG, JPG, JPEG, GIF até 10MB</p>
              <button
                @click="$refs.fileInput.click()"
                class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Escolher Arquivo
              </button>
            </div>

            <div v-else class="space-y-4">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p class="text-lg text-gray-600">Fazendo upload...</p>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  :style="{ width: uploadProgress + '%' }"
                ></div>
              </div>
              <p class="text-sm text-gray-500">{{ uploadProgress }}%</p>
            </div>
          </div>

          <!-- Preview da imagem selecionada -->
          <div v-if="selectedFile && !uploading" class="mt-6 text-center">
            <img 
              :src="previewUrl" 
              :alt="selectedFile.name"
              class="max-w-xs max-h-48 mx-auto rounded-lg shadow-md"
            />
            <p class="text-sm text-gray-600 mt-2">{{ selectedFile.name }}</p>
            <div class="mt-4 space-x-4">
              <button
                @click="uploadFile"
                class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Fazer Upload
              </button>
              <button
                @click="clearSelection"
                class="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Swal from 'sweetalert2'
import axios from 'axios'

interface FileInfo {
  name: string
  size: number
  lastModified: string
}

// Estados reativas
const files = ref<FileInfo[]>([])
const loading = ref(true)
const loadingMore = ref(false)
const hasMore = ref(true)
const currentPage = ref(1)
const deletingFiles = ref<string[]>([])

// Upload states
const selectedFile = ref<File | null>(null)
const previewUrl = ref<string>('')
const uploading = ref(false)
const uploadProgress = ref(0)

// API base URL
const API_BASE_URL = 'http://localhost:3000'

// Carregar arquivos iniciais
const loadFiles = async (page = 1, append = false) => {
  try {
    if (!append) {
      loading.value = true
    } else {
      loadingMore.value = true
    }

    const response = await axios.get(`${API_BASE_URL}/api/files`, {
      params: { page, limit: 10 }
    })

    const newFiles = response.data.files || []
    
    if (append) {
      files.value = [...files.value, ...newFiles]
    } else {
      files.value = newFiles
    }

    hasMore.value = response.data.hasMore || false
    currentPage.value = page

  } catch (error) {
    console.error('Erro ao carregar arquivos:', error)
    Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: 'Erro ao carregar arquivos. Tente novamente.'
    })
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

// Carregar mais arquivos
const loadMoreFiles = () => {
  if (!loadingMore.value && hasMore.value) {
    loadFiles(currentPage.value + 1, true)
  }
}

// Scroll infinito
const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.offsetHeight

  if (scrollTop + windowHeight >= documentHeight - 1000) {
    loadMoreFiles()
  }
}

// Confirmar deleção
const confirmDelete = async (fileName: string) => {
  const result = await Swal.fire({
    title: 'Confirmar remoção',
    text: `Tem certeza que deseja remover o arquivo "${fileName}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Sim, remover',
    cancelButtonText: 'Cancelar'
  })

  if (result.isConfirmed) {
    await deleteFile(fileName)
  }
}

// Deletar arquivo
const deleteFile = async (fileName: string) => {
  try {
    deletingFiles.value.push(fileName)
    
    await axios.delete(`${API_BASE_URL}/api/files/${encodeURIComponent(fileName)}`)
    
    files.value = files.value.filter(file => file.name !== fileName)
    
    Swal.fire({
      icon: 'success',
      title: 'Sucesso',
      text: 'Arquivo removido com sucesso!',
      timer: 2000,
      showConfirmButton: false
    })

  } catch (error) {
    console.error('Erro ao deletar arquivo:', error)
    Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: 'Erro ao remover arquivo. Tente novamente.'
    })
  } finally {
    deletingFiles.value = deletingFiles.value.filter(name => name !== fileName)
  }
}

// Manipular seleção de arquivo
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return

  // Validar se é imagem
  if (!file.type.startsWith('image/')) {
    Swal.fire({
      icon: 'error',
      title: 'Arquivo inválido',
      text: 'Por favor, selecione apenas arquivos de imagem (PNG, JPG, JPEG, GIF).'
    })
    return
  }

  // Validar tamanho (10MB)
  if (file.size > 10 * 1024 * 1024) {
    Swal.fire({
      icon: 'error',
      title: 'Arquivo muito grande',
      text: 'O arquivo deve ter no máximo 10MB.'
    })
    return
  }

  selectedFile.value = file
  previewUrl.value = URL.createObjectURL(file)
}

// Fazer upload
const uploadFile = async () => {
  if (!selectedFile.value) return

  try {
    uploading.value = true
    uploadProgress.value = 0

    const formData = new FormData()
    formData.append('file', selectedFile.value)

    await axios.post(`${API_BASE_URL}/api/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          uploadProgress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        }
      }
    })

    Swal.fire({
      icon: 'success',
      title: 'Sucesso',
      text: 'Arquivo enviado com sucesso!',
      timer: 2000,
      showConfirmButton: false
    })

    clearSelection()
    // Recarregar lista de arquivos
    await loadFiles(1, false)

  } catch (error) {
    console.error('Erro ao fazer upload:', error)
    Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: 'Erro ao enviar arquivo. Tente novamente.'
    })
  } finally {
    uploading.value = false
    uploadProgress.value = 0
  }
}

// Limpar seleção
const clearSelection = () => {
  selectedFile.value = null
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = ''
  }
}

// Verificar se é imagem
const isImage = (fileName: string) => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
  return imageExtensions.some(ext => fileName.toLowerCase().endsWith(ext))
}

// URL do arquivo
const getFileUrl = (fileName: string) => {
  return `${API_BASE_URL}/api/files/${encodeURIComponent(fileName)}/view`
}

// Formatar tamanho do arquivo
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Formatar data
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Lifecycle
onMounted(() => {
  loadFiles()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
})
</script>
