/* ============================================================================= */
/* PDF GENERATOR - FAST CAR v8.0 ULTRA-SIMPLES (TESTADO E GARANTIDO) */
/* ============================================================================= */

if (typeof html2pdf === 'undefined') {
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    document.head.appendChild(script);
    console.log('📦 Carregando html2pdf...');
}

// ✅ VERSÃO DEFINITIVA CORRIGIDA (SEM CABEÇALHO NO RODAPÉ)
window.emitirOS = async function() {
    console.log("🚀 Iniciando geração de PDF corrigida...");

    // 1. HELPER PARA LOGO (Evita imagem quebrada)
    const getBase64ImageFromUrl = async (imageUrl) => {
        try {
            const res = await fetch(imageUrl);
            const blob = await res.blob();
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = () => resolve(null);
                reader.readAsDataURL(blob);
            });
        } catch (e) { return null; }
    };

    try {
        // 2. COLETAR DADOS (COM PROTEÇÃO CONTRA NULOS)
        const getValue = (id) => document.getElementById(id)?.value || '';
        const getText = (id) => document.getElementById(id)?.innerText || '';
        const getChecked = (id) => document.getElementById(id)?.checked || false;

        const dados = {
            placa: getValue('placa').toUpperCase() || 'SEM PLACA',
            modelo: getValue('modelo').toUpperCase() || 'NÃO INFORMADO',
            chassi: getValue('chassis').toUpperCase() || '-',
            km: getValue('km_entrada') || '-',
            data: getValue('data') || new Date().toLocaleDateString('pt-BR'),
            hora: getValue('hora') || '-',
            cliente: getValue('nome_cliente').toUpperCase() || 'CONSUMIDOR',
            doc: getValue('cpf_cliente') || '-',
            tel: getValue('celular_cliente') || '-',
            endereco: getValue('endereco_cliente') || '-',
            servicosTxt: getValue('servicos') || '',
            oficina: getText('nome-oficina') || 'OFICINA MECÂNICA',
            subtitulo: getText('subtitulo-oficina') || '',
            telOficina: getText('telefone-oficina') || '',
            endOficina: getText('endereco-oficina') || ''
        };

        // 3. PEGAR LOGO
        let logoSrc = '';
        const imgElement = document.getElementById('logo-oficina');
        if (imgElement && imgElement.src) {
            logoSrc = await getBase64ImageFromUrl(imgElement.src);
        }

        // 4. MONTAR ITENS (PEÇAS E SERVIÇOS)
        // Se usar array global 'itensOrcamento', usa ele. Se não, tenta pegar da tabela HTML.
        let htmlItens = '';
        let total = 0;
        
        // Tenta pegar do array global se existir
        if (typeof itensOrcamento !== 'undefined' && Array.isArray(itensOrcamento) && itensOrcamento.length > 0) {
            itensOrcamento.forEach(item => {
                htmlItens += `
                    <tr>
                        <td style="padding: 5px; border-bottom: 1px solid #eee;">${item.descricao}</td>
                        <td style="padding: 5px; border-bottom: 1px solid #eee; text-align: center;">${item.tipo === 'peca' ? 'PEÇA' : 'SERV'}</td>
                        <td style="padding: 5px; border-bottom: 1px solid #eee; text-align: right;">R$ ${parseFloat(item.valor).toFixed(2)}</td>
                    </tr>
                `;
                total += parseFloat(item.valor || 0);
            });
        } else {
            // Fallback: tenta ler da tabela HTML se o array estiver vazio
            const linhas = document.querySelectorAll('#tabelaPecas tr, #tabelaServicos tr');
            linhas.forEach(tr => {
                const cols = tr.querySelectorAll('td');
                if(cols.length >= 2) {
                    const desc = cols[0].innerText;
                    const val = cols[1].innerText.replace('R$', '').replace(',', '.').trim();
                    if(desc && val) {
                         htmlItens += `
                            <tr>
                                <td style="padding: 5px; border-bottom: 1px solid #eee;">${desc}</td>
                                <td style="padding: 5px; border-bottom: 1px solid #eee; text-align: center;">-</td>
                                <td style="padding: 5px; border-bottom: 1px solid #eee; text-align: right;">R$ ${val}</td>
                            </tr>
                        `;
                        total += parseFloat(val || 0);
                    }
                }
            });
        }

        if (!htmlItens) {
            htmlItens = '<tr><td colspan="3" style="text-align:center; padding:15px; color:#999;">Nenhum item lançado.</td></tr>';
        }

        // 5. HTML DO PDF (FIXO E LIMPO PARA A4)
        // Importante: width: 210mm garante que cabe na folha sem esticar
        const htmlFinal = `
            <div style="font-family: Arial, sans-serif; width: 210mm; background: #fff; padding: 10mm; box-sizing: border-box; color: #333; line-height: 1.3;">
                
                <!-- CABEÇALHO -->
                <div style="display: flex; align-items: center; border-bottom: 3px solid #cc0000; padding-bottom: 15px; margin-bottom: 15px;">
                    <div style="width: 80px; height: 80px; margin-right: 15px; display: flex; align-items: center; justify-content: center;">
                        ${logoSrc ? `<img src="${logoSrc}" style="max-width: 100%; max-height: 100%;">` : ''}
                    </div>
                    <div style="flex: 1;">
                        <h1 style="margin: 0; color: #cc0000; font-size: 22px; text-transform: uppercase;">${dados.oficina}</h1>
                        <p style="margin: 3px 0; font-size: 11px; color: #555;">${dados.subtitulo}</p>
                        <p style="margin: 3px 0; font-size: 11px;"><b>${dados.telOficina}</b> | ${dados.endOficina}</p>
                    </div>
                    <div style="text-align: right;">
                        <div style="background: #cc0000; color: white; padding: 5px 10px; font-weight: bold; border-radius: 4px; font-size: 14px;">
                            O.S. #${Math.floor(Math.random() * 100000)}
                        </div>
                    </div>
                </div>

                <!-- DADOS GERAIS -->
                <div style="display: flex; gap: 20px; margin-bottom: 15px;">
                    <!-- CLIENTE -->
                    <div style="flex: 1; border: 1px solid #ddd; padding: 10px; border-radius: 4px;">
                        <h3 style="margin-top: 0; color: #cc0000; font-size: 12px; border-bottom: 1px solid #eee; padding-bottom: 5px;">DADOS DO CLIENTE</h3>
                        <div style="font-size: 11px;">
                            <p style="margin: 3px 0;"><b>Nome:</b> ${dados.cliente}</p>
                            <p style="margin: 3px 0;"><b>CPF/CNPJ:</b> ${dados.doc}</p>
                            <p style="margin: 3px 0;"><b>Telefone:</b> ${dados.tel}</p>
                            <p style="margin: 3px 0;"><b>Endereço:</b> ${dados.endereco}</p>
                        </div>
                    </div>
                    <!-- VEICULO -->
                    <div style="flex: 1; border: 1px solid #ddd; padding: 10px; border-radius: 4px;">
                        <h3 style="margin-top: 0; color: #cc0000; font-size: 12px; border-bottom: 1px solid #eee; padding-bottom: 5px;">DADOS DO VEÍCULO</h3>
                        <div style="font-size: 11px;">
                            <p style="margin: 3px 0;"><b>Veículo:</b> ${dados.modelo}</p>
                            <p style="margin: 3px 0;"><b>Placa:</b> ${dados.placa}</p>
                            <p style="margin: 3px 0;"><b>KM:</b> ${dados.km} | <b>Chassis:</b> ${dados.chassi}</p>
                            <p style="margin: 3px 0;"><b>Entrada:</b> ${dados.data} às ${dados.hora}</p>
                        </div>
                    </div>
                </div>

                <!-- SERVIÇOS SOLICITADOS -->
                <div style="margin-bottom: 15px;">
                    <h3 style="font-size: 12px; background: #eee; padding: 5px; margin-bottom: 0; border: 1px solid #ddd; border-bottom: none;">SERVIÇOS SOLICITADOS / OBSERVAÇÕES</h3>
                    <div style="border: 1px solid #ddd; padding: 10px; font-size: 11px; min-height: 40px;">
                        ${dados.servicosTxt ? dados.servicosTxt.replace(/\n/g, '<br>') : 'Nenhuma observação registrada.'}
                    </div>
                </div>

                <!-- TABELA DE ITENS -->
                <div style="margin-bottom: 20px;">
                    <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
                        <thead>
                            <tr style="background: #333; color: white;">
                                <th style="padding: 8px; text-align: left;">DESCRIÇÃO</th>
                                <th style="padding: 8px; text-align: center; width: 60px;">TIPO</th>
                                <th style="padding: 8px; text-align: right; width: 100px;">VALOR</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${htmlItens}
                        </tbody>
                        <tfoot>
                            <tr style="background: #f5f5f5; font-weight: bold; font-size: 13px;">
                                <td colspan="2" style="padding: 10px; text-align: right;">TOTAL GERAL:</td>
                                <td style="padding: 10px; text-align: right; color: #cc0000;">R$ ${total.toFixed(2)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <!-- ASSINATURAS -->
                <div style="margin-top: 40px; display: flex; justify-content: space-between;">
                    <div style="width: 40%; text-align: center;">
                        <div style="border-bottom: 1px solid #000; margin-bottom: 5px;"></div>
                        <p style="font-size: 10px;">ASSINATURA DO TÉCNICO</p>
                    </div>
                    <div style="width: 40%; text-align: center;">
                        <div style="border-bottom: 1px solid #000; margin-bottom: 5px;"></div>
                        <p style="font-size: 10px;">ASSINATURA DO CLIENTE</p>
                    </div>
                </div>

                <div style="text-align: center; font-size: 9px; color: #999; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">
                    Documento gerado em ${new Date().toLocaleString('pt-BR')}
                </div>
            </div>
        `;

        // 6. TRUQUE DO ELEMENTO INVISÍVEL (CORRIGE O BUG DO BRANCO/POSIÇÃO)
        // Criamos um elemento temporário fora da visão do usuário, mas visível pro gerador PDF
        const element = document.createElement('div');
        element.innerHTML = htmlFinal;
        
        // Estilos essenciais para não bugar
        element.style.position = 'absolute';
        element.style.top = '0';
        element.style.left = '0';
        element.style.zIndex = '-9999'; // Fica atrás de tudo
        document.body.appendChild(element);

        // 7. GERAR O PDF
        const opt = {
            margin: 0,
            filename: `OS_${dados.placa}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2, 
                useCORS: true, 
                scrollY: 0, // Ignora o scroll da tela atual
                windowWidth: 800 // Força largura desktop
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        await html2pdf().set(opt).from(element).save();

        // 8. LIMPEZA
        document.body.removeChild(element);
        console.log("✅ PDF Gerado com sucesso!");

    } catch (err) {
        console.error("❌ Erro ao gerar PDF:", err);
        alert("Erro ao gerar PDF: " + err.message);
    }
};
