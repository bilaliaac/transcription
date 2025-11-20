import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Header
      appName: 'Transcription Studio',
      languageSwitcher: 'Language',
      themeSwitcher: 'Theme',
      
      // Upload Panel
      uploadTitle: 'Upload Media',
      uploadSubtitle: 'Drag and drop your audio or video file here, or click to browse',
      uploadButton: 'Choose File',
      orDivider: 'OR',
      youtubeLabel: 'YouTube URL',
      youtubePlaceholder: 'Paste YouTube link here...',
      transcribeYouTube: 'Transcribe YouTube',
      uploadError: 'Upload failed. Please try again.',
      invalidYouTube: 'Please enter a valid YouTube URL',
      uploadProgress: 'Uploading...',
      
      // Job Status
      jobId: 'Job ID',
      status: 'Status',
      statusQueued: 'Queued',
      statusTranscribing: 'Transcribing',
      statusDiarizing: 'Diarizing',
      statusAligning: 'Aligning',
      statusDone: 'Done',
      statusError: 'Error',
      retryButton: 'Retry',
      
      // Waveform Player
      play: 'Play',
      pause: 'Pause',
      speed: 'Speed',
      loop: 'Loop Selection',
      
      // Transcript
      transcriptTitle: 'Transcript',
      searchPlaceholder: 'Search transcript...',
      timestamp: 'Time',
      speaker: 'Speaker',
      text: 'Text',
      noTranscript: 'No transcript available yet',
      editSpeaker: 'Edit speaker name',
      
      // Speaker Panel
      speakersTitle: 'Speakers',
      renameSpeaker: 'Rename',
      
      // Export Panel
      exportTitle: 'Export',
      downloadSRT: 'Download SRT',
      downloadVTT: 'Download VTT',
      downloadTXT: 'Download TXT',
      downloadJSON: 'Download JSON',
      sendToOtto: 'Send to Otto',
      comingSoon: 'Coming Soon',
      
      // Jobs List
      jobsTitle: 'Recent Jobs',
      noJobs: 'No jobs yet',
      selectJob: 'Select a job to view',
      createdAt: 'Created',
      
      // Empty State
      emptyTitle: 'Get Started',
      emptyDescription: 'Upload a file or paste a YouTube link to begin transcription',
      
      // Search
      searchResults: '{{count}} result',
      searchResults_other: '{{count}} results',
      nextMatch: 'Next',
      previousMatch: 'Previous',
      
      // Common
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      close: 'Close',
      loading: 'Loading...',
    }
  },
  fr: {
    translation: {
      // Header
      appName: 'Studio de Transcription',
      languageSwitcher: 'Langue',
      themeSwitcher: 'Thème',
      
      // Upload Panel
      uploadTitle: 'Télécharger un média',
      uploadSubtitle: 'Glissez-déposez votre fichier audio ou vidéo ici, ou cliquez pour parcourir',
      uploadButton: 'Choisir un fichier',
      orDivider: 'OU',
      youtubeLabel: 'URL YouTube',
      youtubePlaceholder: 'Collez le lien YouTube ici...',
      transcribeYouTube: 'Transcrire YouTube',
      uploadError: 'Échec du téléchargement. Veuillez réessayer.',
      invalidYouTube: 'Veuillez entrer une URL YouTube valide',
      uploadProgress: 'Téléchargement...',
      
      // Job Status
      jobId: 'ID du travail',
      status: 'Statut',
      statusQueued: 'En attente',
      statusTranscribing: 'Transcription',
      statusDiarizing: 'Diarisation',
      statusAligning: 'Alignement',
      statusDone: 'Terminé',
      statusError: 'Erreur',
      retryButton: 'Réessayer',
      
      // Waveform Player
      play: 'Lecture',
      pause: 'Pause',
      speed: 'Vitesse',
      loop: 'Boucler la sélection',
      
      // Transcript
      transcriptTitle: 'Transcription',
      searchPlaceholder: 'Rechercher dans la transcription...',
      timestamp: 'Temps',
      speaker: 'Locuteur',
      text: 'Texte',
      noTranscript: 'Aucune transcription disponible',
      editSpeaker: 'Modifier le nom du locuteur',
      
      // Speaker Panel
      speakersTitle: 'Locuteurs',
      renameSpeaker: 'Renommer',
      
      // Export Panel
      exportTitle: 'Exporter',
      downloadSRT: 'Télécharger SRT',
      downloadVTT: 'Télécharger VTT',
      downloadTXT: 'Télécharger TXT',
      downloadJSON: 'Télécharger JSON',
      sendToOtto: 'Envoyer à Otto',
      comingSoon: 'Bientôt disponible',
      
      // Jobs List
      jobsTitle: 'Travaux récents',
      noJobs: 'Aucun travail',
      selectJob: 'Sélectionnez un travail à afficher',
      createdAt: 'Créé le',
      
      // Empty State
      emptyTitle: 'Commencer',
      emptyDescription: 'Téléchargez un fichier ou collez un lien YouTube pour commencer la transcription',
      
      // Search
      searchResults: '{{count}} résultat',
      searchResults_other: '{{count}} résultats',
      nextMatch: 'Suivant',
      previousMatch: 'Précédent',
      
      // Common
      cancel: 'Annuler',
      save: 'Enregistrer',
      delete: 'Supprimer',
      close: 'Fermer',
      loading: 'Chargement...',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
