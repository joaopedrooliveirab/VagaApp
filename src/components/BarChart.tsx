import { useState } from 'react';

import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../constants/theme';

type BarChartProps = {
  data: { label: string; value: number }[];
  // Nome do que é contado, usado nos textos de acessibilidade.
  unit: string;
};

const PLOT_HEIGHT = 140;
const LABEL_SPACE = 20;
const TICK_HEIGHT = 14;
// Os textos do gráfico têm altura fixa: limitam o aumento da fonte do sistema.
const FONT_CAP = 1.2;
const GRID = '#E2E8F0';

// Uma série só: sem legenda (o título da seção já diz o que é).
// Marcas finas com a ponta arredondada, rótulo apenas no maior valor,
// no mais recente e na barra tocada. Os demais valores ficam na tabela.
export function BarChart({ data, unit }: BarChartProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [asTable, setAsTable] = useState(false);

  const max = Math.max(...data.map((item) => item.value), 0);
  const top = Math.max(2, Math.ceil(max / 2) * 2);
  const maxIndex = data.findIndex((item) => item.value === max);
  const lastIndex = data.length - 1;
  const labelStep = data.length <= 4 ? 1 : data.length <= 8 ? 2 : 3;

  const toggle = (
    <Pressable
      accessibilityRole="button"
      onPress={() => setAsTable((value) => !value)}
      style={styles.toggle}
    >
      <Text style={styles.toggleText}>
        {asTable ? 'Ver gráfico' : 'Ver em tabela'}
      </Text>
    </Pressable>
  );

  if (asTable) {
    return (
      <View style={styles.wrapper}>
        <View accessibilityRole="list">
          {data.map((item) => (
            <View key={item.label} style={styles.row}>
              <Text style={styles.rowLabel}>
                Semana de {item.label}
              </Text>
              <Text style={styles.rowValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        {toggle}
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.chart}>
        <View style={styles.axis}>
          {[top, top / 2, 0].map((tick) => (
            <Text
              key={tick}
              style={styles.tick}
              maxFontSizeMultiplier={FONT_CAP}
            >
              {tick}
            </Text>
          ))}
        </View>

        <View style={styles.plot}>
          <View style={styles.grid} pointerEvents="none">
            <View style={styles.gridLine} />
            <View style={styles.gridLine} />
            <View style={styles.gridLine} />
          </View>

          <View style={styles.columns}>
            {data.map((item, index) => {
              const showValue =
                index === maxIndex ||
                index === lastIndex ||
                index === selected;
              const showLabel = (lastIndex - index) % labelStep === 0;

              return (
                <Pressable
                  key={item.label}
                  accessibilityLabel={`Semana de ${item.label}: ${item.value} ${unit}`}
                  onPress={() =>
                    setSelected(selected === index ? null : index)
                  }
                  style={styles.column}
                >
                  {showValue && (
                    <Text
                      style={styles.value}
                      maxFontSizeMultiplier={FONT_CAP}
                    >
                      {item.value}
                    </Text>
                  )}

                  <View
                    style={[
                      styles.bar,
                      { height: (item.value / top) * PLOT_HEIGHT },
                    ]}
                  />

                  <Text
                    style={styles.xLabel}
                    maxFontSizeMultiplier={FONT_CAP}
                  >
                    {showLabel ? item.label : ''}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>

      <Text style={styles.caption}>
        Cada barra representa uma semana, identificada pelo dia em que
        ela começa. Toque em uma barra para ver o valor.
      </Text>

      {toggle}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 10,
  },

  chart: {
    flexDirection: 'row',
    gap: 8,
  },

  axis: {
    width: 26,
    // Cada número tem 14 de altura; o centro do primeiro e do último
    // coincide com a primeira e a última linha de grade.
    height: PLOT_HEIGHT + TICK_HEIGHT,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginVertical: LABEL_SPACE - TICK_HEIGHT / 2,
  },

  tick: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: TICK_HEIGHT,
  },

  plot: {
    flex: 1,
    height: PLOT_HEIGHT + LABEL_SPACE * 2,
  },

  grid: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: LABEL_SPACE,
    bottom: LABEL_SPACE,
    justifyContent: 'space-between',
  },

  gridLine: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: GRID,
  },

  columns: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },

  column: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  value: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 16,
  },

  bar: {
    width: '80%',
    maxWidth: 24,
    backgroundColor: colors.primary,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },

  xLabel: {
    color: colors.muted,
    fontSize: 10,
    height: LABEL_SPACE,
    width: 44,
    paddingTop: 6,
    textAlign: 'center',
  },

  caption: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },

  toggle: {
    alignSelf: 'flex-start',
    minHeight: 44,
    justifyContent: 'center',
  },

  toggleText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: GRID,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 10,
  },

  rowLabel: {
    color: colors.text,
    fontSize: 14,
  },

  rowValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
});
