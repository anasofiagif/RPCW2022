# Warmup:

Testa a API de dados com o Postman e dá resposta às seguintes questões:

1. Quantos processos (nível 3) e quais são (obtem uma lista em JSON; podes concatenar sublistas invocando várias queries), pertencentes à descendência da classe 750?

    **R.:** 18 

    ```json
    [
        {
            "codigo": "750.10.001",
            "titulo": "Seleção e seriação para ingresso no ensino ou formação",
            "id": "http://jcr.di.uminho.pt/m51-clav#c750.10.001",
            "status": "A"
        },
        {
            "codigo": "750.10.002",
            "titulo": "Processamento de matrículas ou inscrições no ensino ou em formação",
            "id": "http://jcr.di.uminho.pt/m51-clav#c750.10.002",
            "status": "A"
        },
        {
            "codigo": "750.10.300",
            "titulo": "Processamento dos dados cadastrais de alunos ou formandos",
            "id": "http://jcr.di.uminho.pt/m51-clav#c750.10.300",
            "status": "A"
        },
        {
            "codigo": "750.10.600",
            "titulo": "Controlo de assiduidade de alunos ou formandos",
            "id": "http://jcr.di.uminho.pt/m51-clav#c750.10.600",
            "status": "A"
        },
        {
            "codigo": "750.10.601",
            "titulo": "Processamento de marcação e admissão a provas de avaliação",
            "id": "http://jcr.di.uminho.pt/m51-clav#c750.10.601",
            "status": "A"
        },
        {
            "codigo": "750.10.602",
            "titulo": "Integração e acompanhamento de alunos com necessidades educativas especiais",
            "id": "http://jcr.di.uminho.pt/m51-clav#c750.10.602",
            "status": "A"
        },
        {
            "codigo": "750.20.001",
            "titulo": "Conceção, revisão e extinção de currículos e planos de estudos",
            "id": "http://jcr.di.uminho.pt/m51-clav#c750.20.001",
            "status": "A"
        },
        {
            "codigo": "750.20.002",
            "titulo": "Conceção, revisão e extinção de planos de ações de formação",
            "id": "http://jcr.di.uminho.pt/m51-clav#c750.20.002",
            "status": "A"
        },
        {
            "codigo": "750.20.003",
            "titulo": "Avaliação da atividade pedagógica",
            "id": "http://jcr.di.uminho.pt/m51-clav#c750.20.003",
            "status": "H"
        },
        {
            "codigo": "750.20.300",
            "titulo": "Produção e seleção de recursos didático-pedagógicos",
            "id": "http://jcr.di.uminho.pt/m51-clav#c750.20.300",
            "status": "A"
        },
        {
            "codigo": "750.20.301",
            "titulo": "Distribuição de atividades de ensino ou formação",
            "id": "http://jcr.di.uminho.pt/m51-clav#c750.20.301",
            "status": "A"
        },
        {
            "codigo": "750.20.600",
            "titulo": "Realização de atividades de ensino ou formação",
            "id": "http://jcr.di.uminho.pt/m51-clav#c750.20.600",
            "status": "A"
        },
        {
            "codigo": "750.20.601",
            "titulo": "Realização de atividades de formação e treino animal",
            "id": "http://jcr.di.uminho.pt/m51-clav#c750.20.601",
            "status": "A"
        },
        {
            "codigo": "750.30.001",
            "titulo": "Conceção e revisão dos métodos de avaliação de aprendizagens",
            "id": "http://jcr.di.uminho.pt/m51-clav#c750.30.001",
            "status": "A"
        },
        {
            "codigo": "750.30.300",
            "titulo": "Elaboração de instrumentos de avaliação de aprendizagens",
            "id": "http://jcr.di.uminho.pt/m51-clav#c750.30.300",
            "status": "A"
        },
        {
            "codigo": "750.30.600",
            "titulo": "Aplicação de instrumentos de avaliação de aprendizagens",
            "id": "http://jcr.di.uminho.pt/m51-clav#c750.30.600",
            "status": "A"
        },
        {
            "codigo": "750.30.601",
            "titulo": "Processamento e comunicação de resultados de avaliação",
            "id": "http://jcr.di.uminho.pt/m51-clav#c750.30.601",
            "status": "A"
        },
        {
            "codigo": "750.30.602",
            "titulo": "Reconhecimento, creditação e validação de competências e qualificações",
            "id": "http://jcr.di.uminho.pt/m51-clav#c750.30.602",
            "status": "A"
        }
    ]
    ```

2. Quantos subprocessos existem no catálogo inteiro? (classes de nível 4)

    **R.:** 118 subprocessos

3. Quantos processos (classes de nível 3) se encontram na descendência de 750.30?

    **R.:** 5 processos

4. Quantos processos (classes de nível 3) estão relacionados com 750.30.001?

    **R.:** 6 processos



