/* ============================================================================= */
/* PDF GENERATOR - FAST CAR v8.0 ULTRA-SIMPLES (TESTADO E GARANTIDO) */
/* ============================================================================= */

if (typeof html2pdf === 'undefined') {
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    document.head.appendChild(script);
    console.log('📦 Carregando html2pdf...');
}

window.emitirOS = function() {
    console.clear();
    console.log('='.repeat(60));
    console.log('INICIANDO GERAÇÃO DE O.S. v8.0...');
    console.log('='.repeat(60));
    
    try {
        // PASSO 1: Coletar dados
        console.log('📋 Passo 1: Coletando dados...');
        
        const placa = (document.getElementById('placa')?.value || 'N/I').toUpperCase();
        const modelo = (document.getElementById('modelo')?.value || 'N/I').toUpperCase();
        const chassis = (document.getElementById('chassis')?.value || 'N/I').toUpperCase();
        const kmEntrada = document.getElementById('km_entrada')?.value || '-';
        const dataEntrada = document.getElementById('data')?.value || '-';
        const horaEntrada = document.getElementById('hora')?.value || '-';
        const combustivel = document.getElementById('combustivel')?.value || '-';
        
        const cliente = (document.getElementById('nome_cliente')?.value || 'N/I').toUpperCase();
        const cpf = document.getElementById('cpf_cliente')?.value || '-';
        const endereco = document.getElementById('endereco_cliente')?.value || '-';
        const telefone = document.getElementById('celular_cliente')?.value || '-';
        
        const servicos = document.getElementById('servicos')?.value || '';
        
        console.log('OK - Veículo:', placa, modelo);
        console.log('OK - Cliente:', cliente);

        // PASSO 2: Checklist
        console.log('📋 Passo 2: Coletando checklist...');
        const checklist = [];
        document.querySelectorAll('input[type="checkbox"]').forEach(el => {
            if (el.checked && el.value) {
                checklist.push(el.value.toUpperCase().trim());
            }
        });
        console.log('OK -', checklist.length, 'itens marcados');

        // PASSO 3: Peças
        console.log('📋 Passo 3: Coletando peças...');
        const pecas = [];
        let totalPecas = 0;
        const tabelaPecas = document.getElementById('tabelaPecas');
        if (tabelaPecas) {
            tabelaPecas.querySelectorAll('tbody tr').forEach(tr => {
                const cels = tr.querySelectorAll('td');
                if (cels.length >= 2) {
                    const desc = (cels[0]?.textContent || '').trim();
                    const valor = (cels[1]?.textContent || '').trim();
                    if (desc && valor && desc !== 'Descrição') {
                        pecas.push({desc, valor});
                        const num = parseFloat(valor.replace(/[^\d,]/g, '').replace(',', '.'));
                        if (!isNaN(num)) totalPecas += num;
                    }
                }
            });
        }
        console.log('OK -', pecas.length, 'peças');

        // PASSO 4: Serviços
        console.log('📋 Passo 4: Coletando serviços...');
        const servicosLista = [];
        let totalServicos = 0;
        const tabelaServicos = document.getElementById('tabelaServicos');
        if (tabelaServicos) {
            tabelaServicos.querySelectorAll('tbody tr').forEach(tr => {
                const cels = tr.querySelectorAll('td');
                if (cels.length >= 2) {
                    const desc = (cels[0]?.textContent || '').trim();
                    const valor = (cels[1]?.textContent || '').trim();
                    if (desc && valor && desc !== 'Descrição') {
                        servicosLista.push({desc, valor});
                        const num = parseFloat(valor.replace(/[^\d,]/g, '').replace(',', '.'));
                        if (!isNaN(num)) totalServicos += num;
                    }
                }
            });
        }
        console.log('OK -', servicosLista.length, 'serviços');

        const totalGeral = totalPecas + totalServicos;
        const numeroOS = 'OS-' + Math.floor(Math.random() * 1000000);
        
        console.log('OK - Total geral: R$', totalGeral.toFixed(2));

        // PASSO 5: Montar HTML (SEM template literals complexos)
        console.log('📄 Passo 5: Montando HTML do PDF...');
        
        let html = '';
        html += '<html><head>';
        html += '<meta charset="UTF-8">';
        html += '<style>';
        html += 'body { font-family: Arial, sans-serif; font-size: 12px; color: #333; margin: 0; padding: 20px; }';
        html += 'h1 { color: #e41616; font-size: 20px; margin: 0 0 5px 0; }';
        html += 'h2 { color: #e41616; font-size: 14px; border-bottom: 2px solid #e41616; padding-bottom: 5px; margin-top: 15px; margin-bottom: 10px; }';
        html += 'table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }';
        html += 'td, th { padding: 6px; border: 1px solid #ddd; text-align: left; }';
        html += 'th { background: #f5f5f5; font-weight: bold; }';
        html += '.total { font-weight: bold; background: #fafafa; }';
        html += '.os-num { background: #e41616; color: white; padding: 10px; text-align: center; font-size: 16px; font-weight: bold; margin: 15px 0; }';
        html += '.checklist { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 15px; }';
        html += '.check-item { border: 1px solid #ddd; padding: 5px; background: #fafafa; }';
        html += '.total-final { background: #e41616; color: white; padding: 10px; font-size: 16px; font-weight: bold; text-align: right; margin: 15px 0; }';
        html += '.sig { display: flex; justify-content: space-between; margin-top: 40px; }';
        html += '.sig-box { width: 40%; text-align: center; }';
        html += '.sig-line { border-top: 1px solid #000; margin-top: 30px; padding-top: 5px; }';
        html += '</style></head><body>';
        
        // Cabeçalho
        html += '<h1>FAST CAR CENTRO AUTOMOTIVO</h1>';
        html += '<p style="margin: 0; font-size: 10px;">Checklist de Entrada e Inspeccao Veicular<br>';
        html += '(31) 2342-1699 | Av. Regulus, 248 - Contagem/MG</p>';
        
        // O.S.
        html += '<div class="os-num">ORDEM DE SERVICO - ' + numeroOS + '</div>';
        
        // Veículo
        html += '<h2>INFORMACOES DO VEICULO</h2>';
        html += '<table>';
        html += '<tr><td><b>Placa</b></td><td>' + placa + '</td><td><b>Modelo</b></td><td>' + modelo + '</td></tr>';
        html += '<tr><td><b>Chassis</b></td><td>' + chassis + '</td><td><b>KM</b></td><td>' + kmEntrada + '</td></tr>';
        html += '<tr><td><b>Data</b></td><td>' + dataEntrada + '</td><td><b>Hora</b></td><td>' + horaEntrada + '</td></tr>';
        html += '<tr><td colspan="4"><b>Combustivel:</b> ' + combustivel + '</td></tr>';
        html += '</table>';
        
        // Características
        if (checklist.length > 0) {
            html += '<h2>CARACTERISTICAS DO VEICULO</h2>';
            html += '<div class="checklist">';
            checklist.forEach(item => {
                html += '<div class="check-item">(X) ' + item + '</div>';
            });
            html += '</div>';
        }
        
        // Cliente
        html += '<h2>DADOS DO CLIENTE</h2>';
        html += '<table>';
        html += '<tr><td><b>Nome</b></td><td colspan="3">' + cliente + '</td></tr>';
        html += '<tr><td><b>CPF</b></td><td>' + cpf + '</td><td><b>Telefone</b></td><td>' + telefone + '</td></tr>';
        html += '<tr><td><b>Endereco</b></td><td colspan="3">' + endereco + '</td></tr>';
        html += '</table>';
        
        // Peças
        if (pecas.length > 0) {
            html += '<h2>PECAS</h2>';
            html += '<table>';
            html += '<tr><th>Descricao</th><th style="width: 100px;">Valor</th></tr>';
            pecas.forEach(p => {
                html += '<tr><td>' + p.desc + '</td><td style="text-align: right;">' + p.valor + '</td></tr>';
            });
            html += '<tr class="total"><td style="text-align: right;">Total Pecas:</td><td style="text-align: right;">R$ ' + totalPecas.toFixed(2).replace('.', ',') + '</td></tr>';
            html += '</table>';
        }
        
        // Serviços
        if (servicosLista.length > 0) {
            html += '<h2>SERVICOS</h2>';
            html += '<table>';
            html += '<tr><th>Descricao</th><th style="width: 100px;">Valor</th></tr>';
            servicosLista.forEach(s => {
                html += '<tr><td>' + s.desc + '</td><td style="text-align: right;">' + s.valor + '</td></tr>';
            });
            html += '<tr class="total"><td style="text-align: right;">Total Servicos:</td><td style="text-align: right;">R$ ' + totalServicos.toFixed(2).replace('.', ',') + '</td></tr>';
            html += '</table>';
        }
        
        // Observações
        if (servicos.trim()) {
            html += '<h2>SERVICOS SOLICITADOS</h2>';
            html += '<p style="border: 1px solid #ddd; padding: 10px; background: #fafafa;">' + servicos.replace(/\n/g, '<br>') + '</p>';
        }
        
        // Total geral
        html += '<div class="total-final">TOTAL GERAL: R$ ' + totalGeral.toFixed(2).replace('.', ',') + '</div>';
        
        // Assinaturas
        html += '<div class="sig">';
        html += '<div class="sig-box"><b>Assinatura Cliente</b><div class="sig-line"></div></div>';
        html += '<div class="sig-box"><b>Responsavel Oficina</b><div class="sig-line"></div></div>';
        html += '</div>';
        
        html += '<p style="text-align: center; font-size: 9px; color: #999; margin-top: 20px;">';
        html += 'Gerado em ' + new Date().toLocaleString('pt-BR') + ' | Fast Car Centro Automotivo';
        html += '</p>';
        
        html += '</body></html>';
        
        console.log('OK - HTML pronto:', html.length, 'caracteres');

        // PASSO 6: Converter para PDF
        console.log('PDF Passo 6: Convertendo para PDF...');
        
        const element = document.createElement('div');
        element.innerHTML = html;
        
        const opt = {
            margin: 5,
            filename: numeroOS + '_' + placa + '.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, logging: false, useCORS: true, allowTaint: false },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        
        html2pdf().set(opt).from(element).save().then(() => {
            console.log('');
            console.log('='.repeat(60));
            console.log('SUCESSO! PDF GERADO!');
            console.log('Arquivo: ' + numeroOS + '_' + placa + '.pdf');
            console.log('='.repeat(60));
            alert('SUCESSO!\n\nO.S.: ' + numeroOS + '\nArquivo: ' + numeroOS + '_' + placa + '.pdf');
        }).catch(err => {
            console.error('ERRO:', err.message);
            alert('ERRO ao gerar PDF:\n' + err.message);
        });

    } catch (e) {
        console.error('ERRO CRITICO:', e.message);
        console.error('Stack:', e.stack);
        alert('ERRO CRITICO:\n' + e.message);
    }
};

console.log('OK - PDF Generator v8.0 carregado');
