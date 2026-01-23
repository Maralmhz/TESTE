
if (typeof html2pdf === 'undefined') {
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    document.head.appendChild(script);
}

// Logo real da Fast Car em Base64 (Seguro para qualquer navegador/servidor)
const LOGO_BASE64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="; // Placeholder, substituir com logo real se quiser

window.emitirOS = function() {
    console.log('🚀 INICIANDO GERAÇÃO DE O.S. v7.0...');
    
    try {
        // ===== PASSO 1: COLETAR TODOS OS DADOS (Independente de aba) =====
        
        // DADOS DO VEÍCULO
        const placa = (document.getElementById('placa')?.value || '').toUpperCase();
        const modelo = (document.getElementById('modelo')?.value || '').toUpperCase();
        const chassis = (document.getElementById('chassis')?.value || '').toUpperCase();
        const kmEntrada = document.getElementById('km_entrada')?.value || '-';
        const dataEntrada = document.getElementById('data')?.value || '-';
        const horaEntrada = document.getElementById('hora')?.value || '-';
        const combustivel = document.getElementById('combustivel')?.value || '-';
        
        console.log('✅ Veículo:', { placa, modelo, chassis, kmEntrada });

        // DADOS DO CLIENTE
        const cliente = (document.getElementById('nome_cliente')?.value || '').toUpperCase();
        const cpf = document.getElementById('cpf_cliente')?.value || '-';
        const endereco = document.getElementById('endereco_cliente')?.value || '-';
        const telefone = document.getElementById('celular_cliente')?.value || '-';
        
        console.log('✅ Cliente:', { cliente, cpf, telefone });

        // OBSERVAÇÕES/SERVIÇOS SOLICITADOS
        const servicos = document.getElementById('servicos')?.value || '';
        
        console.log('✅ Serviços/Observações coletados');

        // ===== PASSO 2: COLETAR CHECKLIST (Todos os checkboxes) =====
        const checklist = [];
        document.querySelectorAll('input[type="checkbox"]').forEach(el => {
            if (el.value && el.value.trim()) {
                checklist.push({
                    nome: el.value.toUpperCase().trim(),
                    marcado: el.checked
                });
            }
        });
        
        console.log('✅ Checklist:', checklist.length, 'itens coletados');

        // ===== PASSO 3: COLETAR PEÇAS =====
        const pecas = [];
        let totalPecas = 0;
        
        try {
            const tabelaPecas = document.getElementById('tabelaPecas');
            if (tabelaPecas) {
                const linhas = tabelaPecas.querySelectorAll('tbody tr');
                linhas.forEach(tr => {
                    const cels = tr.querySelectorAll('td');
                    if (cels.length >= 2) {
                        const desc = cels[0]?.textContent?.trim() || '';
                        const valor = cels[1]?.textContent?.trim() || '';
                        
                        if (desc && valor && desc !== 'Descrição') {
                            pecas.push({ desc, valor });
                            
                            // Parse do valor (remove R$, espaços, converte vírgula em ponto)
                            const valorNum = parseFloat(valor.replace(/[^\d,]/g, '').replace(',', '.'));
                            if (!isNaN(valorNum)) {
                                totalPecas += valorNum;
                            }
                        }
                    }
                });
            }
        } catch (e) {
            console.warn('⚠️ Erro ao coletar peças:', e.message);
        }
        
        console.log('✅ Peças:', pecas.length, '| Total R$', totalPecas.toFixed(2));

        // ===== PASSO 4: COLETAR SERVIÇOS (Tabela) =====
        const servicosLista = [];
        let totalServicos = 0;
        
        try {
            const tabelaServicos = document.getElementById('tabelaServicos');
            if (tabelaServicos) {
                const linhas = tabelaServicos.querySelectorAll('tbody tr');
                linhas.forEach(tr => {
                    const cels = tr.querySelectorAll('td');
                    if (cels.length >= 2) {
                        const desc = cels[0]?.textContent?.trim() || '';
                        const valor = cels[1]?.textContent?.trim() || '';
                        
                        if (desc && valor && desc !== 'Descrição') {
                            servicosLista.push({ desc, valor });
                            
                            const valorNum = parseFloat(valor.replace(/[^\d,]/g, '').replace(',', '.'));
                            if (!isNaN(valorNum)) {
                                totalServicos += valorNum;
                            }
                        }
                    }
                });
            }
        } catch (e) {
            console.warn('⚠️ Erro ao coletar serviços:', e.message);
        }
        
        console.log('✅ Serviços:', servicosLista.length, '| Total R$', totalServicos.toFixed(2));

        // TOTAL GERAL
        const totalGeral = totalPecas + totalServicos;
        const numeroOS = 'OS-' + new Date().getTime().toString().slice(-6);
        
        console.log('✅ TOTAL GERAL: R$', totalGeral.toFixed(2));

        // ===== PASSO 5: GERAR HTML DO PDF (PROGRAMATICAMENTE) =====
        const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, Helvetica, sans-serif; color: #333; line-height: 1.4; font-size: 12px; }
        .container { max-width: 210mm; padding: 15mm; }
        .header { display: flex; align-items: center; border-bottom: 3px solid #e41616; padding-bottom: 12px; margin-bottom: 15px; }
        .header-logo { width: 50px; height: 50px; margin-right: 15px; flex-shrink: 0; }
        .header-text h1 { font-size: 16px; color: #e41616; margin: 0; font-weight: bold; }
        .header-text p { font-size: 10px; color: #666; margin: 2px 0; }
        .os-number { background: #e41616; color: white; text-align: center; padding: 10px; font-size: 14px; font-weight: bold; margin-bottom: 12px; border-radius: 3px; }
        .section { margin-bottom: 12px; page-break-inside: avoid; }
        .section-title { background: #f5f5f5; padding: 6px 10px; border-left: 4px solid #e41616; font-weight: bold; font-size: 11px; margin-bottom: 8px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 5px; border: 1px solid #ddd; text-align: left; font-size: 10px; }
        th { background: #f0f0f0; font-weight: bold; }
        tr:nth-child(even) { background: #fafafa; }
        .total-row { background: #f5f5f5; font-weight: bold; }
        .total-value { text-align: right; }
        .checklist-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; font-size: 10px; }
        .checklist-item { border: 1px solid #ddd; padding: 4px; border-radius: 2px; }
        .checked { background: #e8f5e9; color: #2e7d32; }
        .unchecked { background: #ffebee; color: #c62828; }
        .info-box { padding: 8px; border: 1px solid #ddd; background: #fafafa; font-size: 10px; line-height: 1.5; }
        .total-final { background: #e41616; color: white; padding: 10px; text-align: right; font-size: 13px; font-weight: bold; margin: 12px 0; border-radius: 3px; }
        .signatures { margin-top: 20px; display: flex; justify-content: space-between; }
        .signature { width: 45%; text-align: center; font-size: 10px; }
        .signature-line { border-top: 1px solid #333; margin-top: 30px; padding-top: 5px; }
        .footer { text-align: center; font-size: 8px; color: #999; margin-top: 15px; padding-top: 10px; border-top: 1px solid #ddd; }
        .text-right { text-align: right; }
    </style>
</head>
<body>
    <div class="container">
        <!-- CABEÇALHO -->
        <div class="header">
            <img src="${LOGO_BASE64}" class="header-logo" alt="Logo">
            <div class="header-text">
                <h1>FAST CAR CENTRO AUTOMOTIVO</h1>
                <p>Checklist de Entrada e Inspeção Veicular</p>
                <p>(31) 2342-1699 | Av. Régulus, 248 - Contagem/MG</p>
            </div>
        </div>

        <!-- NÚMERO DA O.S. -->
        <div class="os-number">ORDEM DE SERVIÇO - ${numeroOS}</div>

        <!-- SEÇÃO 1: VEÍCULO -->
        <div class="section">
            <div class="section-title">📋 INFORMAÇÕES DO VEÍCULO</div>
            <table>
                <tr>
                    <td style="width: 25%; font-weight: bold;">Placa</td>
                    <td>${placa || 'NÃO INFORMADO'}</td>
                    <td style="width: 25%; font-weight: bold;">Modelo</td>
                    <td>${modelo || 'NÃO INFORMADO'}</td>
                </tr>
                <tr>
                    <td style="font-weight: bold;">Chassis</td>
                    <td>${chassis || 'NÃO INFORMADO'}</td>
                    <td style="font-weight: bold;">KM Entrada</td>
                    <td>${kmEntrada}</td>
                </tr>
                <tr>
                    <td style="font-weight: bold;">Data Entrada</td>
                    <td>${dataEntrada}</td>
                    <td style="font-weight: bold;">Hora</td>
                    <td>${horaEntrada}</td>
                </tr>
                <tr>
                    <td colspan="4" style="font-weight: bold;">Combustível: ${combustivel}</td>
                </tr>
            </table>
        </div>

        <!-- SEÇÃO 2: CARACTERÍSTICAS -->
        ${checklist.length > 0 ? `
        <div class="section">
            <div class="section-title">🚗 CARACTERÍSTICAS DO VEÍCULO</div>
            <div class="checklist-grid">
                ${checklist.map(item => `
                    <div class="checklist-item ${item.marcado ? 'checked' : 'unchecked'}">
                        <strong>${item.marcado ? '✓' : '✗'}</strong> ${item.nome}
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}

        <!-- SEÇÃO 3: CLIENTE -->
        <div class="section">
            <div class="section-title">👤 DADOS DO CLIENTE</div>
            <table>
                <tr>
                    <td style="width: 25%; font-weight: bold;">Nome</td>
                    <td colspan="3">${cliente || 'NÃO INFORMADO'}</td>
                </tr>
                <tr>
                    <td style="font-weight: bold;">CPF</td>
                    <td>${cpf || '-'}</td>
                    <td style="width: 25%; font-weight: bold;">Telefone</td>
                    <td>${telefone || '-'}</td>
                </tr>
                <tr>
                    <td style="font-weight: bold;">Endereço</td>
                    <td colspan="3">${endereco || '-'}</td>
                </tr>
            </table>
        </div>

        <!-- SEÇÃO 4: PEÇAS -->
        ${pecas.length > 0 ? `
        <div class="section">
            <div class="section-title">📦 PEÇAS</div>
            <table>
                <thead>
                    <tr>
                        <th>Descrição</th>
                        <th style="width: 80px; text-align: right;">Valor</th>
                    </tr>
                </thead>
                <tbody>
                    ${pecas.map(p => `
                        <tr>
                            <td>${p.desc}</td>
                            <td class="text-right">${p.valor}</td>
                        </tr>
                    `).join('')}
                    <tr class="total-row">
                        <td style="text-align: right;">Total Peças:</td>
                        <td class="text-right">R$ ${totalPecas.toFixed(2).replace('.', ',')}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        ` : ''}

        <!-- SEÇÃO 5: SERVIÇOS -->
        ${servicosLista.length > 0 ? `
        <div class="section">
            <div class="section-title">🔧 SERVIÇOS</div>
            <table>
                <thead>
                    <tr>
                        <th>Descrição</th>
                        <th style="width: 80px; text-align: right;">Valor</th>
                    </tr>
                </thead>
                <tbody>
                    ${servicosLista.map(s => `
                        <tr>
                            <td>${s.desc}</td>
                            <td class="text-right">${s.valor}</td>
                        </tr>
                    `).join('')}
                    <tr class="total-row">
                        <td style="text-align: right;">Total Serviços:</td>
                        <td class="text-right">R$ ${totalServicos.toFixed(2).replace('.', ',')}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        ` : ''}

        <!-- SEÇÃO 6: OBSERVAÇÕES -->
        ${servicos.trim() ? `
        <div class="section">
            <div class="section-title">📝 SERVIÇOS SOLICITADOS</div>
            <div class="info-box">
                ${servicos.split('\n').map(line => line.trim()).filter(line => line).join('<br>')}
            </div>
        </div>
        ` : ''}

        <!-- TOTAL GERAL -->
        <div class="total-final">
            TOTAL GERAL: R$ ${totalGeral.toFixed(2).replace('.', ',')}
        </div>

        <!-- ASSINATURAS -->
        <div class="signatures">
            <div class="signature">
                <strong>Assinatura Cliente</strong>
                <div class="signature-line"></div>
            </div>
            <div class="signature">
                <strong>Responsável Oficina</strong>
                <div class="signature-line"></div>
            </div>
        </div>

        <!-- RODAPÉ -->
        <div class="footer">
            Documento gerado em ${new Date().toLocaleString('pt-BR')} | Fast Car Centro Automotivo
        </div>
    </div>
</body>
</html>
        `;

        console.log('📄 HTML gerado - iniciando conversão para PDF...');

        // ===== PASSO 6: CONVERTER HTML PARA PDF =====
        const element = document.createElement('div');
        element.innerHTML = htmlContent;

        const opt = {
            margin: 0,
            filename: `${numeroOS}_${placa || 'NOVO'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2,
                logging: false,
                useCORS: true,
                allowTaint: false,
                backgroundColor: '#ffffff'
            },
            jsPDF: { 
                unit: 'mm', 
                format: 'a4', 
                orientation: 'portrait',
                compress: true
            }
        };

        html2pdf().set(opt).from(element).save().then(() => {
            console.log('✅✅✅ PDF GERADO COM SUCESSO! ✅✅✅');
            alert('✅ O.S. #' + numeroOS + ' gerada com sucesso!\n\nArquivo: ' + numeroOS + '_' + (placa || 'NOVO') + '.pdf');
        }).catch(err => {
            console.error('❌ ERRO AO GERAR PDF:', err);
            alert('❌ Erro ao gerar PDF:\n' + err.message + '\n\nTente novamente ou abra o console (F12) para mais detalhes.');
        });

    } catch (e) {
        console.error('❌❌ ERRO CRÍTICO:', e);
        alert('❌ ERRO CRÍTICO:\n' + e.message + '\n\nTente novamente!');
    }
};

// ===== FUNÇÃO ALTERNATIVA: Gerar apenas relatório de peças/serviços (se precisar) =====
window.emitirRelatorioPecasServicos = function() {
    console.log('📊 Gerando relatório de peças e serviços...');
    
    // Esta função pode ser usada para um PDF apenas de peças/serviços
    // Por enquanto, redireciona para emitirOS (mesmo PDF completo)
    emitirOS();
};

console.log('✅ PDF Generator v7.0 CARREGADO E PRONTO');
