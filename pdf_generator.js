if (typeof html2pdf === 'undefined') {
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    document.head.appendChild(script);
}

// LOGO EM BASE64 (Seguro para gerar PDF em qualquer lugar)
const LOGO_BASE64 = "data:image/png;base64,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";

window.emitirOS = function() {
    console.log('🔄 Iniciando geração de O.S. COMPLETA (v6.0)...');
    
    try {
        // ===== COLETA DE DADOS - VEÍCULO =====
        const placa = (document.querySelector('input[id="placa"]')?.value || 'NÃO INFORMADO').toUpperCase();
        const modelo = (document.querySelector('input[id="modelo"]')?.value || 'NÃO INFORMADO').toUpperCase();
        const chassis = (document.querySelector('input[id="chassis"]')?.value || 'NÃO INFORMADO').toUpperCase();
        const kmEntrada = document.querySelector('input[id="km_entrada"]')?.value || '-';
        const dataEntrada = document.querySelector('input[id="data"]')?.value || new Date().toLocaleDateString('pt-BR');
        const horaEntrada = document.querySelector('input[id="hora"]')?.value || '-';
        const combustivel = document.querySelector('select[id="combustivel"]')?.value || '-';
        
        console.log('✓ Dados do veículo:', { placa, modelo, chassis });

        // ===== COLETA DE DADOS - CLIENTE =====
        const cliente = (document.querySelector('input[id="nome_cliente"]')?.value || 'NÃO INFORMADO').toUpperCase();
        const cpf = document.querySelector('input[id="cpf_cliente"]')?.value || '-';
        const telefone = document.querySelector('input[id="celular_cliente"]')?.value || '-';
        const endereco = document.querySelector('input[id="endereco_cliente"]')?.value || '-';
        
        console.log('✓ Dados do cliente:', { cliente });

        // ===== COLETA DE CHECKLIST (CARACTERÍSTICAS) =====
        const checklistItems = [];
        document.querySelectorAll('input[type="checkbox"]').forEach(el => {
            if (el.value && el.value.trim()) {
                checklistItems.push({ 
                    nome: el.value.toUpperCase(), 
                    marcado: el.checked 
                });
            }
        });
        
        console.log('✓ Checklist coletado:', checklistItems.length, 'items');

        // ===== COLETA DE SERVIÇOS/OBSERVAÇÕES =====
        const servicos = document.querySelector('textarea[id="servicos"]')?.value || '-';
        
        console.log('✓ Serviços/Observações coletados');

        // ===== COLETA DE PEÇAS =====
        const pecas = [];
        let totalPecas = 0;
        const tabelaPecas = document.getElementById('tabelaPecas');
        if (tabelaPecas) {
            tabelaPecas.querySelectorAll('tbody tr').forEach(tr => {
                const celulas = tr.querySelectorAll('td');
                if (celulas.length >= 2) {
                    const desc = celulas[0]?.textContent?.trim();
                    const valor = celulas[1]?.textContent?.trim();
                    if (desc && valor) {
                        pecas.push({ desc, valor });
                        const v = parseFloat(valor.replace(/[^\d,.-]/g, '').replace(',', '.'));
                        if (!isNaN(v)) totalPecas += v;
                    }
                }
            });
        }
        
        console.log('✓ Peças coletadas:', pecas.length, '- Total:', totalPecas.toFixed(2));

        // ===== COLETA DE SERVIÇOS (TABELA) =====
        const servicosLista = [];
        let totalServicos = 0;
        const tabelaServicos = document.getElementById('tabelaServicos');
        if (tabelaServicos) {
            tabelaServicos.querySelectorAll('tbody tr').forEach(tr => {
                const celulas = tr.querySelectorAll('td');
                if (celulas.length >= 2) {
                    const desc = celulas[0]?.textContent?.trim();
                    const valor = celulas[1]?.textContent?.trim();
                    if (desc && valor) {
                        servicosLista.push({ desc, valor });
                        const v = parseFloat(valor.replace(/[^\d,.-]/g, '').replace(',', '.'));
                        if (!isNaN(v)) totalServicos += v;
                    }
                }
            });
        }
        
        console.log('✓ Serviços coletados:', servicosLista.length, '- Total:', totalServicos.toFixed(2));

        const totalGeral = totalPecas + totalServicos;
        const numeroOS = 'OS-' + new Date().getTime().toString().slice(-6);

        // ===== MONTA HTML PROFISSIONAL PARA PDF =====
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6;">
                
                <!-- CABEÇALHO -->
                <div style="display: flex; align-items: center; border-bottom: 4px solid #e41616; padding-bottom: 15px; margin-bottom: 20px;">
                    <img src="${LOGO_BASE64}" style="width: 70px; height: 70px; margin-right: 20px;" />
                    <div>
                        <h2 style="margin:0; color:#e41616; font-size: 20px;">FAST CAR CENTRO AUTOMOTIVO</h2>
                        <p style="margin:3px 0; font-size:12px; color:#555;">Checklist de Entrada e Inspeção Veicular</p>
                        <p style="margin:2px 0; font-size:11px; color:#666;">(31) 2342-1699 | Av. Régulus, 248 - Contagem/MG</p>
                    </div>
                </div>

                <!-- NÚMERO DA O.S. -->
                <div style="background:#e41616; color:white; padding:12px 15px; text-align:center; font-weight:bold; font-size:16px; margin-bottom:20px; border-radius: 4px;">
                    ORDEM DE SERVIÇO - ${numeroOS}
                </div>

                <!-- SEÇÃO 1: INFORMAÇÕES DO VEÍCULO -->
                <div style="margin-bottom:20px; page-break-inside: avoid;">
                    <h3 style="background:#f5f5f5; padding:8px 12px; border-left:5px solid #e41616; font-size:13px; margin:0 0 12px 0; font-weight:bold;">📋 INFORMAÇÕES DO VEÍCULO</h3>
                    <table style="width:100%; font-size:12px; border-collapse: collapse;">
                        <tr style="background:#fafafa;">
                            <td style="padding:8px; border: 1px solid #ddd; width:25%;"><strong>Placa:</strong></td>
                            <td style="padding:8px; border: 1px solid #ddd;">${placa}</td>
                            <td style="padding:8px; border: 1px solid #ddd; width:25%;"><strong>Modelo:</strong></td>
                            <td style="padding:8px; border: 1px solid #ddd;">${modelo}</td>
                        </tr>
                        <tr>
                            <td style="padding:8px; border: 1px solid #ddd;"><strong>Chassis:</strong></td>
                            <td style="padding:8px; border: 1px solid #ddd;">${chassis}</td>
                            <td style="padding:8px; border: 1px solid #ddd;"><strong>KM Entrada:</strong></td>
                            <td style="padding:8px; border: 1px solid #ddd;">${kmEntrada}</td>
                        </tr>
                        <tr style="background:#fafafa;">
                            <td style="padding:8px; border: 1px solid #ddd;"><strong>Data:</strong></td>
                            <td style="padding:8px; border: 1px solid #ddd;">${dataEntrada}</td>
                            <td style="padding:8px; border: 1px solid #ddd;"><strong>Hora:</strong></td>
                            <td style="padding:8px; border: 1px solid #ddd;">${horaEntrada}</td>
                        </tr>
                        <tr>
                            <td style="padding:8px; border: 1px solid #ddd;"><strong>Combustível:</strong></td>
                            <td colspan="3" style="padding:8px; border: 1px solid #ddd;">${combustivel}</td>
                        </tr>
                    </table>
                </div>

                <!-- SEÇÃO 2: CARACTERÍSTICAS DO VEÍCULO -->
                ${checklistItems.length > 0 ? `
                <div style="margin-bottom:20px; page-break-inside: avoid;">
                    <h3 style="background:#f5f5f5; padding:8px 12px; border-left:5px solid #e41616; font-size:13px; margin:0 0 12px 0; font-weight:bold;">🚗 CARACTERÍSTICAS DO VEÍCULO</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap:8px; font-size:11px;">
                        ${checklistItems.map(item => `
                            <div style="border:1px solid #ddd; padding:6px; background:${item.marcado ? '#e8f5e9' : '#ffebee'}; border-radius: 3px;">
                                <span style="color:${item.marcado ? '#2e7d32' : '#c62828'}; font-weight:bold;">${item.marcado ? '✓' : '✗'}</span> ${item.nome}
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}

                <!-- SEÇÃO 3: DADOS DO CLIENTE -->
                <div style="margin-bottom:20px; page-break-inside: avoid;">
                    <h3 style="background:#f5f5f5; padding:8px 12px; border-left:5px solid #e41616; font-size:13px; margin:0 0 12px 0; font-weight:bold;">👤 DADOS DO CLIENTE</h3>
                    <table style="width:100%; font-size:12px; border-collapse: collapse;">
                        <tr style="background:#fafafa;">
                            <td style="padding:8px; border: 1px solid #ddd; width:25%;"><strong>Nome:</strong></td>
                            <td colspan="3" style="padding:8px; border: 1px solid #ddd;">${cliente}</td>
                        </tr>
                        <tr>
                            <td style="padding:8px; border: 1px solid #ddd;"><strong>CPF:</strong></td>
                            <td style="padding:8px; border: 1px solid #ddd;">${cpf}</td>
                            <td style="padding:8px; border: 1px solid #ddd;"><strong>Telefone:</strong></td>
                            <td style="padding:8px; border: 1px solid #ddd;">${telefone}</td>
                        </tr>
                        <tr style="background:#fafafa;">
                            <td style="padding:8px; border: 1px solid #ddd;"><strong>Endereço:</strong></td>
                            <td colspan="3" style="padding:8px; border: 1px solid #ddd;">${endereco}</td>
                        </tr>
                    </table>
                </div>

                <!-- SEÇÃO 4: PEÇAS -->
                ${pecas.length > 0 ? `
                <div style="margin-bottom:15px; page-break-inside: avoid;">
                    <h3 style="background:#f5f5f5; padding:8px 12px; border-left:5px solid #e41616; font-size:13px; margin:0 0 8px 0; font-weight:bold;">📦 PEÇAS</h3>
                    <table style="width:100%; font-size:11px; border-collapse: collapse;">
                        <thead>
                            <tr style="background:#f0f0f0;">
                                <th style="padding:6px; border: 1px solid #ddd; text-align:left;">Descrição</th>
                                <th style="padding:6px; border: 1px solid #ddd; text-align:right; width:100px;">Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${pecas.map(p => `
                                <tr>
                                    <td style="padding:6px; border: 1px solid #ddd;">${p.desc}</td>
                                    <td style="padding:6px; border: 1px solid #ddd; text-align:right;">${p.valor}</td>
                                </tr>
                            `).join('')}
                            <tr style="background:#fafafa; font-weight:bold;">
                                <td style="padding:6px; border: 1px solid #ddd; text-align:right;">Total Peças:</td>
                                <td style="padding:6px; border: 1px solid #ddd; text-align:right;">R$ ${totalPecas.toFixed(2).replace('.', ',')}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                ` : ''}

                <!-- SEÇÃO 5: SERVIÇOS -->
                ${servicosLista.length > 0 ? `
                <div style="margin-bottom:15px; page-break-inside: avoid;">
                    <h3 style="background:#f5f5f5; padding:8px 12px; border-left:5px solid #e41616; font-size:13px; margin:0 0 8px 0; font-weight:bold;">🔧 SERVIÇOS</h3>
                    <table style="width:100%; font-size:11px; border-collapse: collapse;">
                        <thead>
                            <tr style="background:#f0f0f0;">
                                <th style="padding:6px; border: 1px solid #ddd; text-align:left;">Descrição</th>
                                <th style="padding:6px; border: 1px solid #ddd; text-align:right; width:100px;">Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${servicosLista.map(s => `
                                <tr>
                                    <td style="padding:6px; border: 1px solid #ddd;">${s.desc}</td>
                                    <td style="padding:6px; border: 1px solid #ddd; text-align:right;">${s.valor}</td>
                                </tr>
                            `).join('')}
                            <tr style="background:#fafafa; font-weight:bold;">
                                <td style="padding:6px; border: 1px solid #ddd; text-align:right;">Total Serviços:</td>
                                <td style="padding:6px; border: 1px solid #ddd; text-align:right;">R$ ${totalServicos.toFixed(2).replace('.', ',')}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                ` : ''}

                <!-- SEÇÃO 6: OBSERVAÇÕES/SERVIÇOS SOLICITADOS -->
                ${servicos && servicos !== '-' ? `
                <div style="margin-bottom:15px; page-break-inside: avoid;">
                    <h3 style="background:#f5f5f5; padding:8px 12px; border-left:5px solid #e41616; font-size:13px; margin:0 0 8px 0; font-weight:bold;">🔧 SERVIÇOS SOLICITADOS</h3>
                    <div style="padding:10px; border:1px solid #ddd; background:#fafafa; font-size:11px; line-height:1.5;">
                        ${servicos.split('\n').join('<br/>')}
                    </div>
                </div>
                ` : ''}

                <!-- TOTAIS -->
                <div style="margin:20px 0; page-break-inside: avoid;">
                    <div style="background:#e41616; color:white; padding:12px 15px; text-align:right; font-size:14px; font-weight:bold; border-radius: 4px;">
                        TOTAL GERAL: R$ ${totalGeral.toFixed(2).replace('.', ',')}
                    </div>
                </div>

                <!-- ASSINATURAS -->
                <div style="margin-top:40px; page-break-inside: avoid;">
                    <div style="display:flex; justify-content:space-between; text-align:center; font-size:11px;">
                        <div style="width:45%; border-top:1px solid #333; padding-top:15px;">
                            <strong>Assinatura Cliente</strong><br/>
                            ________________________
                        </div>
                        <div style="width:45%; border-top:1px solid #333; padding-top:15px;">
                            <strong>Responsável Oficina</strong><br/>
                            ________________________
                        </div>
                    </div>
                </div>

                <div style="text-align:center; font-size:10px; color:#999; margin-top:20px; border-top:1px solid #ddd; padding-top:10px;">
                    Documento gerado em ${new Date().toLocaleString('pt-BR')}<br/>
                    Fast Car Centro Automotivo - Contagem/MG
                </div>
            </div>
        `;

        console.log('📄 Gerando PDF: ' + numeroOS + '...');

        const element = document.createElement('div');
        element.innerHTML = htmlContent;

        const opt = {
            margin: 8,
            filename: `${numeroOS}_${placa}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2, 
                logging: false, 
                useCORS: true,
                allowTaint: false
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save().then(() => {
            console.log('✅ PDF GERADO COM SUCESSO!');
            alert('✅ O.S. #' + numeroOS + ' gerada com sucesso!\n\nArquivo: ' + numeroOS + '_' + placa + '.pdf');
        }).catch(err => {
            console.error('❌ ERRO:', err);
            alert('❌ Erro ao gerar PDF:\n' + err.message);
        });

    } catch (e) {
        console.error('❌ ERRO CRÍTICO:', e);
        alert('❌ Erro crítico: ' + e.message);
    }
};
