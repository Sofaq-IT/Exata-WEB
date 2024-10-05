import Swal from 'sweetalert2';
import router from '@/router';

class AlertService {
  sucesso(msg, redirect = null) {
    Swal.fire({
      icon: 'success',
      title: 'Sucesso!',
      text: msg ? msg : 'A operação foi executada com sucesso.',
    }).then(() => {

      if (redirect)
        router.push(redirect);
    });
  }
  
  info(msg, redirect = null) {
    Swal.fire({
      icon: 'info',
      title: 'Informação!',
      text: msg ? msg : 'Essa é apenas uma mensagem informativa.',
    }).then(() => {

      if (redirect)
        router.push(redirect);
    });
  }

  erro(msg, redirect = null) {
    Swal.fire({
      icon: 'error',
      title: 'Ops! Temos um problema.',
      text: msg ? msg : 'O sistema encontrou um erro. Informe ao administrador do sistema.',
    }).then(() => {

      if (redirect)
        router.push(redirect);
    });
  }
}

export default new AlertService();
